<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class PackUser extends Model
{
    use HasFactory;

    public function pack(){
        return $this->belongsTo(Pack::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    protected $fillable = [
        'user_storage',
        'user_group',
        'status'
    ];

    protected $dates = ["next_cycle_date", "cycle_date"];

    protected $connection = "mongodb";

}
