<?php 

namespace GemaDigital\FileManager\app\Models\Traits;

use GemaDigital\FileManager\app\Models\Media;
use GemaDigital\FileManager\app\Models\MediaField;

trait MediaTrait
{
    public static function afterCreate($entry){
        \DB::beginTransaction();
        try{
            foreach(self::$mediable as $column){
                if( $entry[$column] !== null){
                    $decoded = json_decode($entry[$column]);
                    if(isset($decoded->medias)){
                        $mediaIds = $decoded->medias;
                        $mediaField = MediaField::create([
                            'entity_type' => self::class,
                            'entity_id' => $entry->id
                        ]);

                        $entry[$column] = $mediaField->id;

                        $data = [];

                        foreach($mediaIds as $mediaId){
                            array_push($data, [
                                    'media_id' => $mediaId,
                                    'media_field_id' => $mediaField->id
                                ]);
                        }

                        \DB::table('media_field_has_media')->insert($data);
                        $entry::withoutEvents(function() use($entry) {
                            return $entry->save();
                        });
                    }
                }
            }

            \DB::commit();

        }catch(\Exception $e){
            \DB::rollback();
        }
    }

    public static function afterUpdate($entry){
        \DB::beginTransaction();
        try{
            $original = $entry->getOriginal();

            foreach(self::$mediable as $column){
                \DB::table('media_field_has_media')
                    ->where('media_field_id', $original[$column])
                    ->delete();  
            }

            MediaField::where('entity_id', $entry->id)
                    ->where('entity_type', self::class)
                    ->delete();   
                    
            \DB::commit();

            self::afterCreate($entry);

        }catch(\Exception $e){
            \DB::rollback();
        }
    }
}