<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InitDb extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /*
        Schema::create('category', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',30);
            $table->timestamps();
            $table->unique('name');
        });

        Schema::create('word', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('count');
            $table->integer('state');
            $table->string('name',30);
            $table->string('pronun',30);
            $table->string('origin',30);
            $table->string('family');
            $table->string('lettertype',50);
            $table->string('category',30);
            $table->string('variant');
            $table->text('meaning');
            $table->text('example');
            $table->dateTime('viewed_at');
            $table->timestamps();
        });
        */
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //Schema::dropIfExists('category');

        //Schema::dropIfExists('word');
    }
}
