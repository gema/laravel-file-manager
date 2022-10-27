<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMediaCombinations extends Migration
{
    public function up()
    {
        Schema::create('media_types_has_combinations', function (Blueprint $table) {
            $table->foreignId('media_type_id')->constrained('media_types');
            $table->foreignId('combinated_media_type_id')->constrained('media_types');
        });

        Schema::create('media_has_combinations', function (Blueprint $table) {
            $table->foreignId('media_id')->constrained('medias');
            $table->foreignId('combinated_media_id')->constrained('medias');
        });
    }

    public function down()
    {
        Schema::dropIfExists('media_types_has_combinations');
        Schema::dropIfExists('media_has_combinations');
    }
}
