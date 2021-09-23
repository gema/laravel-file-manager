<?php

namespace GemaDigital\FileManager\app\Http\Controllers\API;

use DB;
use GemaDigital\FileManager\app\Models\Media;
use GemaDigital\FileManager\app\Models\MediaContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MediaAPIController
{
    public function addTags(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'tags' => 'required',
            'medias' => 'required',
        ]);

        if ($validation->fails()) {
            return json_response(null, 422, 200, $validation->errors());
        }

        $medias = explode(',', $request->medias);
        $tags = explode(',', $request->tags);

        $mediaTags = \DB::table('media_has_tags')->whereIn('media_id', $medias)->get()->pluck('tag_id', 'media_id');

        $data = [];

        foreach ($medias as $mediaId) {
            foreach ($tags as $tagId) {
                $tagExists = false;
                foreach ($mediaTags as $media_id => $tag_id) {
                    if ($media_id == $mediaId && $tag_id == $tagId) {
                        $tagExists = true;
                    }
                }
                if (!$tagExists) {
                    array_push($data, [
                        'media_id' => $mediaId,
                        'tag_id' => $tagId,
                    ]);
                }
            }
        }

        $inserted = \DB::table('media_has_tags')->insert($data);

        return json_response($inserted);
    }

    public function removeTags(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'tags' => 'required',
            'medias' => 'required',
        ]);

        if ($validation->fails()) {
            return json_response(null, 422, 200, $validation->errors());
        }

        $medias = explode(',', $request->medias);
        $tags = explode(',', $request->tags);

        $response = [];
        $errors = [];

        $response = \DB::table('media_has_tags')
            ->whereIn('media_id', $medias)
            ->whereIn('tag_id', $tags)
            ->delete();

        return json_response($response);
    }

    public function uploadMedia(Request $request)
    {
        $preview;
        $validation = Validator::make($request->all(), [
            'media' => 'required',
            'name' => 'required',
            'parentId' => 'nullable',
            'title' => 'required',
            'type' => 'required',
            'parent_model' => 'nullable',
        ]);

        $filename = $request->media->getClientOriginalName();

        if ($validation->fails()) {
            return json_response(['filename' => $filename ?: false], 422, 200, $validation->errors());
        }

        DB::beginTransaction();
        try {
            $media = Media::create([
                'parent_id' => $request->parent_id ?: null,
                'parent_type' => $request->parent_model ?: null,
                'type_id' => $request->type,
            ]);

            $disk = config('file-manager.disk');
            if (!$disk) {
                $mediaCloudResponse = $this->mediaCloudRequest($request);
                $mediaContent = MediaContent::create([
                    'media_cloud_id' => $mediaCloudResponse->id,
                    'media_id' => $media->id,
                    'title' => $request->title ?: '[No title provided]',
                    'description' => $request->description ?: '[No description provided]',
                    'preview' => $mediaCloudResponse->preview,
                ]);

                $preview = $mediaCloudResponse->preview !== null ?: '';
            } else {
                $parentFolder = '';
                if ($request->get('parent_model')) {
                    $parentClass = new $request->parent_model;
                    $parent = $parentClass::find($request->parentId);
                    $parentFolder = '';
                    if (isset($parent->name)) {
                        $parentName = $parent->name;
                        if ($this->isJson($parentName)) {
                            $parentFolder = json_decode($parentName)->en;
                        } else {
                            $parentFolder = $parentName;
                        }
                    }

                    $parentFolder = Str::slug($parentFolder);
                }

                $fileName = $request->file('media')->store($parentFolder, $disk);
                $path = Storage::disk($disk)->url($fileName);

                $mediaContent = MediaContent::create([
                    'media_cloud_id' => null,
                    'media_id' => $media->id,
                    'title' => $request->title ?: '[No title provided]',
                    'description' => $request->description ?: '[No description provided]',
                    'preview' => $path,
                    'content' => '{"original" : "' . $path . '"}',
                ]);

                $preview = $path;
            }

            DB::commit();

            return json_response([
                'preview' => $preview,
                'filename' => $filename,
                'success' => true,
                'msg' => 'Media uploaded successfully.',
            ]);
        } catch (\Exception $e) {
            $response = [
                'filename' => $filename,
                'success' => false,
                'msg' => 'Media failed to upload.',
                'error' => 'Media failed to upload.',
            ];

            DB::rollback();

            return json_response($response);
        }
    }

    public function editMedia(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'parent' => 'nullable',
            'title' => 'required',
            'description' => 'required',
        ]);

        if ($validation->fails()) {
            return json_response(null, 422, 200, $validation->errors());
        }

        $mediaContent = MediaContent::find($request->route('id'));
        $media = Media::find($mediaContent->media_id);
        if (!$media || !$mediaContent) {
            return json_response(['updated' => false]);
        }

        if ($request->parent) {
            $media->parent_id = $request->parent;
        }

        $mediaContent->title = $request->title;
        $mediaContent->description = $request->description;

        $media->save();
        $mediaContent->save();

        $mediaData = Media::with('mediaContent')
            ->where('id', $mediaContent->media_id)
            ->first();

        return json_response(['updated' => true, 'media' => $mediaData]);
    }

    private function mediaCloudRequest(Request $request)
    {

        $client = new \GuzzleHttp\Client([
            'headers' => [
                'Content-Type' => 'multipart/form-data',
            ],
        ]);

        $tmpFilePath = 'tmp/' . $request->media->getClientOriginalName();

        // Create Tmp File
        Storage::disk('local')->put(
            $tmpFilePath,
            file_get_contents($request->file('media'))
        );

        // Make request to media cloud
        $response = $client->post(env('MEDIA_CLOUD_ENDPOINT'), [
            'decode_content' => false,
            'multipart' => [
                [
                    'name' => 'file',
                    'contents' => fopen(base_path('storage/app/tmp/' . $request->media->getClientOriginalName()), 'r'),
                ],
                [
                    'name' => 'defaults',
                    'contents' => env('MEDIA_CLOUD_DEFAULTS'),
                ],
                [
                    'name' => 'apikey',
                    'contents' => env('API_KEY'),
                ],
                [
                    'name' => 'path',
                    'contents' => 'client',
                ],
            ],
        ]);

        $bodyResponse = $response->getBody();
        $result = $bodyResponse->getContents();
        $result = json_decode($result);

        // Delete tmp file
        Storage::disk('local')->delete($tmpFilePath);

        return $result;
    }

    public function mediaCloudWebhook(Request $request)
    {
        DB::beginTransaction();
        try {
            $validation = Validator::make($request->all(), [
                'id' => 'required',
                'paths' => 'required|array',
            ]);

            if ($validation->fails()) {
                return json_response(null, 422, 200, $validation->errors());
            }

            $mediaContent = MediaContent::where('media_cloud_id', $request->id)->first();
            if ($mediaContent) {
                $mediaContent->content = $request->paths;
                $mediaContent->save();
                DB::commit();
                return json_response('Transformations paths saved with success for media_cloud_id = ' . $request->id);
            } else {
                return json_response('No medias found with media_cloud_id = ' . $request->id);
            }

        } catch (\Exception $e) {
            DB::rollback();
            return json_response('Something went wrong');
        }
    }

    public function getParents()
    {
        $data = [];
        foreach (config('file-manager.parents') as $class) {
            $object = new $class();
            $result = $object->paginate(10);

            $data[$class] = $result;
        }

        return json_response($data);
    }

    private function isJson($string)
    {
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }
}
