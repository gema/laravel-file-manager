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
                ->where('media_field_id', $mediaFieldId)->get()->pluck('media_id');
            $mediaContents = MediaContent::whereIn('media_id', $mediaIds)->with('media')->get();

            return $mediaContents;
        } catch (\Exception $e) {
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

                        foreach ($mediaIds as $mediaId) {
                            array_push($data, [
                                'media_id' => $mediaId,
                                'media_field_id' => $mediaField->id,
                            ]);
                        }

                        DB::table('media_field_has_media')->insert($data);

                        $entry[$column] = $mediaField->id;
                        $entry->saveQuietly();
                    }
                }
            }

            DB::commit();
        } catch (\Exception $e) {
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
            DB::rollback();
        }
    }
}
