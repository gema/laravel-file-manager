<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
            $table->foreignId('type_id')->constrained('media_types');
            $table->nullableMorphs('parent');

            $table->nullableTimestamps();
        });

        Schema::create('media_content', function (Blueprint $table) {
            $table->id();
            $table->integer('media_cloud_id')->nullable();
            $table->foreignId('media_id')->constrained('medias');
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->string('preview')->nullable();
            $table->text('content')->nullable();
            $table->boolean('state')->default(0);

            $table->nullableTimestamps();
        });

        Schema::create('media_tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->nullableMorphs('parent');

            $table->nullableTimestamps();
        });

        Schema::create('media_has_tags', function (Blueprint $table) {
            $table->foreignId('media_id')->constrained('medias');
            $table->foreignId('tag_id')->constrained('media_tags');

            $table->nullableTimestamps();
        });

        Schema::create('media_versions', function (Blueprint $table) {
            $table->id();
            $table->string('label');

            $table->nullableTimestamps();
        });

        Schema::create('media_type_has_versions', function (Blueprint $table) {
            $table->foreignId('media_type_id')->constrained('media_types');
            $table->foreignId('media_version_id')->constrained('media_versions');

            $table->nullableTimestamps();
        });

        Schema::create('media_fields', function (Blueprint $table) {
            $table->id();
            $table->morphs('entity');

            $table->nullableTimestamps();
        });

        Schema::create('media_field_has_media', function (Blueprint $table) {
            $table->foreignId('media_id')->constrained('medias');
            $table->foreignId('media_field_id')->constrained('media_fields');

            $table->nullableTimestamps();
        });

        // Default types
        DB::table('media_types')->insert([
            ['key' => 'image', 'name' => 'Image'],
            ['key' => 'video', 'name' => 'Video'],
            ['key' => 'audio', 'name' => 'Audio'],
            ['key' => 'document', 'name' => 'Document'],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('media_field_has_media');
        Schema::dropIfExists('media_fields');
        Schema::dropIfExists('media_type_has_versions');
        Schema::dropIfExists('media_versions');
        Schema::dropIfExists('media_has_tags');
        Schema::dropIfExists('media_content');
        Schema::dropIfExists('media_tags');
        Schema::dropIfExists('medias');
        Schema::dropIfExists('media_types');
    }
}
