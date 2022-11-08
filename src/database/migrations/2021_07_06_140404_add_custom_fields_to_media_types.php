<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCustomFieldsToMediaTypes extends Migration
{
    public function up()
    {
        Schema::table('media_types', function (Blueprint $table) {
            $table->text('extra_fields')->nullable();
        });

        Schema::table('media_content', function (Blueprint $table) {
            $table->text('extra_fields')->nullable();
        });
    }

    public function down()
    {
        $table->dropColumn('media_types');
        $table->dropColumn('media_content');
    }
}
