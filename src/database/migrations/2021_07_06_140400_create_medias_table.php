<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use GemaDigital\Framework\app\Helpers\EnumHelper;

class CreateMediasTable extends Migration
{
    public function up()
    {
        Schema::create('media_types', function (Blueprint $table) {
            $table->id();
            $table->string('key');
            $table->string('name');

            $table->nullableTimestamps();
        });

        Schema::create('medias', function (Blueprint $table) {
            $table->id();            
            $table->foreignId('type_id');
            $table->nullableMorphs('parent');

            $table->index(['type_id']);
            $table->foreign('type_id')
                ->references('id')
                ->on('media_types')
                ->onDelete('cascade');

            $table->nullableTimestamps();
        });

        Schema::create('media_content', function (Blueprint $table) {
            $table->id();            
            $table->uuid('uuid');
            $table->foreignId('media_id');
            
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->string('preview');
            $table->text('content')->nullable();

            $table->boolean('state')->default(0);

            $table->nullableTimestamps();

            $table->index(['media_id']);
            $table->foreign('media_id')
                ->references('id')
                ->on('medias')
                ->onDelete('cascade');
        });

        Schema::create('media_tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->nullableMorphs('parent');
            $table->nullableTimestamps();
        });

        Schema::create('media_has_tags', function (Blueprint $table) {
            $table->foreignId('media_id');
            $table->foreignId('tag_id');

            $table->nullableTimestamps();

            $table->index(['media_id']);
            $table->foreign('media_id')
                ->references('id')
                ->on('medias')
                ->onDelete('cascade');

            $table->index(['tag_id']);
            $table->foreign('tag_id')
                ->references('id')
                ->on('media_tags')
                ->onDelete('cascade');
        });

        Schema::create('media_versions', function (Blueprint $table) {
            $table->id();
            $table->string('label');

            $table->nullableTimestamps();
        });

        Schema::create('media_type_has_versions', function (Blueprint $table) {
            $table->foreignId('media_type_id');
            $table->foreignId('media_version_id');

            $table->nullableTimestamps();

            $table->index(['media_type_id']);
            $table->foreign('media_type_id')
                ->references('id')
                ->on('media_types')
                ->onDelete('cascade');

            $table->index(['media_version_id']);
            $table->foreign('media_version_id')
                ->references('id')
                ->on('media_versions')
                ->onDelete('cascade');
        });

        Schema::create('media_fields', function (Blueprint $table) {
            $table->id();
            $table->morphs('entity');

            $table->nullableTimestamps();
        });

        Schema::create('media_field_has_media', function (Blueprint $table) {
            $table->foreignId('media_id');
            $table->foreignId('media_field_id');

            $table->nullableTimestamps();

            $table->index(['media_id']);
            $table->foreign('media_id')
                ->references('id')
                ->on('medias')
                ->onDelete('cascade');

            $table->index(['media_field_id']);
            $table->foreign('media_field_id')
                ->references('id')
                ->on('media_fields')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('media_field_has_media');
        Schema::dropIfExists('media_fields');
        Schema::dropIfExists('media_type_has_versions');
        Schema::dropIfExists('media_types');
        Schema::dropIfExists('media_versions');
        Schema::dropIfExists('media_has_tags');
        Schema::dropIfExists('media_content');
        Schema::dropIfExists('media_tags');
        Schema::dropIfExists('medias');
    }
}
