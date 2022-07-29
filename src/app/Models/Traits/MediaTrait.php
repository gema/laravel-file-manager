<?php

namespace GemaDigital\FileManager\app\Models\Traits;

use DB;
use GemaDigital\FileManager\app\Models\MediaContent;
use GemaDigital\FileManager\app\Models\MediaField;

trait MediaTrait
{
    public function getMedia($column, $mediaFieldId = false)
    {
        if (!$mediaFieldId && $column && isset($this->attributes[$column])) {
            $mediaFieldId = $this->attributes[$column];
        }

        try {
            $mediaIds = DB::table('media_field_has_media')
                ->where('media_field_id', $mediaFieldId)->orderBy('position')->get()->pluck('media_id', 'position');

            $orderedIds = array_values($mediaIds->toArray());
            $mediaContents = MediaContent::whereIn('media_id', $mediaIds)
                ->with('media')->get();

            foreach ($mediaContents as $mediaContent) {
                foreach ($mediaIds as $position => $mediaId) {
                    if ($mediaContent->media_id == $mediaId) {
                        $mediaContent->position = $position;
                    }
                }
            }

            return $mediaContents->sortBy('position')->values();
        } catch (\Exception $e) {
            \Log::info($e);
            return $mediaFieldId;
        }
    }

    public static function afterCreate($entry)
    {
        DB::beginTransaction();
        try {
            foreach (self::$mediable as $column) {
                if ($entry[$column] !== null) {
                    $decoded = json_decode($entry[$column]);
                    if (is_object($decoded) && count($decoded->medias) > 0) {
                        $mediaIds = $decoded->medias;
                        $mediaField = MediaField::create([
                            'entity_type' => self::class,
                            'entity_id' => $entry->id,
                        ]);

                        $data = [];
                        $i = 1;
                        foreach ($mediaIds as $mediaId) {
                            array_push($data, [
                                'media_id' => $mediaId,
                                'media_field_id' => $mediaField->id,
                                'position' => $i,
                            ]);
                            $i++;
                        }

                        DB::table('media_field_has_media')->insert($data);

                        $entry[$column] = $mediaField->id;
                        $entry->saveQuietly();
                    }
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            \Log::info($e);
            DB::rollback();
        }
    }

    public static function afterUpdate($entry)
    {
        DB::beginTransaction();
        try {
            $original = $entry->getOriginal();

            // TODO: MEDIA FIELDS NEED TO BE UPDATED INSTEAD OF DELETE/cREATE

            // foreach (self::$mediable as $column) {
            //     if ($original[$column] !== null) {
            //         DB::table('media_field_has_media')
            //             ->where('media_field_id', $original[$column])
            //             ->delete();
            //     }
            // }

            // MediaField::where('entity_id', $entry->id)
            //     ->where('entity_type', self::class)
            //     ->delete();

            DB::commit();

            self::afterCreate($entry);
        } catch (\Exception $e) {
            \Log::info($e);
            DB::rollback();
        }
    }
}
