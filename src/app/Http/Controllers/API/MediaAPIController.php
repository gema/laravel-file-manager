<?php

namespace GemaDigital\FileManager\app\Http\Controllers\API;

use DB;
use GemaDigital\FileManager\app\Models\Media;
use GemaDigital\FileManager\app\Models\MediaContent;
use GemaDigital\FileManager\app\Models\MediaVersion;
use Illuminate\Http\Request;
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
                'parent_id' => $request->parentId ?: null,
                'parent_type' => $request->parent_model ?: null,
                'type_id' => $request->type,
            ]);

            $mediaCloudResponse = $this->mediaCloudRequest($request);

            $mediaContent = MediaContent::create([
                'uuid' => $mediaCloudResponse['uuid'], // get from media cloud
                'media_id' => $media->id,
                'title' => $request->title ?: '[No title provided]',
                'description' => $request->description ?: '[No description provided]',
                'preview' => $mediaCloudResponse['preview'], // get from media cloud
            ]);

            DB::commit();

            return json_response([
                'preview' => $mediaCloudResponse['preview'],
                'filename' => $filename,
                'success' => true,
                'msg' => 'Media uploaded successfully.',
            ]);
        } catch (\Exception$e) {
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

    protected function mediaCloudRequest($request)
    {
        $file = $request->media;
        $type = $request->type;

        $mediaVersions = MediaVersion::whereHas('mediaTypes', function ($query) use ($type) {
            $query->where('id', $type);
        })->pluck('label');

        $payload = [
            'file' => $file,
            'versions' => $mediaVersions,
        ];

        // Simulate media cloud response
        return [
            'uuid' => Str::uuid(),
            'preview' => 'https://mcleansmartialarts.com/wp-content/uploads/2017/04/default-image-620x600.jpg',
        ];
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
}
