<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangesInMediasStructure extends Migration
{
    public function up()
    {
        Schema::table('media_types', function (Blueprint $table) {
            $table->text('extensions')->nullable()->after('name');
        });

        Schema::table('media_field_has_media', function (Blueprint $table) {
            $table->integer('position')->nullable()->after('media_field_id');
        });
    }

    public function down()
    {
        Schema::table('media_types', function (Blueprint $table) {
            $table->dropColumn('extensions');
        });

        Schema::table('media_field_has_media', function (Blueprint $table) {
            $table->dropColumn('position');
        });
    }
}
