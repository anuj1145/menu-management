<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained();
            $table->foreignId('parent_id')->nullable()->constrained('menu_items');
            $table->string('title');
            $table->integer('depth');
            $table->timestamps();

            $table->dropForeign(['parent_id']); // Drop existing foreign key

            // Add a new foreign key with cascading deletes
            $table->foreign('parent_id')
                  ->references('id')->on('menu_items')
                  ->onDelete('cascade');
        });

       
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
