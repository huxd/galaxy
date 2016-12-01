<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CrateDB extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',30);
            $table->timestamps();
        });

        Schema::create('word', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',30);
            $table->string('origin',30);
            $table->string('lettertype',50);
            $table->string('variant');
            $table->timestamps();
        });

        Schema::create('meaning', function (Blueprint $table) {
            $table->increments('id');
            $table->string('lettertype',50);
            $table->string('variant');
            $table->string('entity',30);
            $table->unsignedInteger('wordid');
            $table->text('example');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('category');

        Schema::dropIfExists('word');

        Schema::dropIfExists('meaning');
    }
}
