<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMediaCombinationsFix extends Migration
{
    public function up()
    {
        Schema::table('media_types_has_combinations', function (Blueprint $table) {
            $table->nullableTimestamps();
        });

        Schema::table('media_has_combinations', function (Blueprint $table) {
            // $table->unique(['media_id', 'combinated_media_id']);
            $table->nullableTimestamps();
        });
    }

    public function down()
    {
        Schema::table('media_types_has_combinations', function (Blueprint $table) {
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });

        Schema::table('media_has_combinations', function (Blueprint $table) {
            $table->dropUnique(['media_id', 'combinated_media_id']);
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
    }
}
