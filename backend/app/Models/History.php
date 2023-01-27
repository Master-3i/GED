<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;
use App\Models\User;

class History extends Model {
    use HasFactory;

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function pack(){
        return $this->belongsTo(Pack::class);
    }

    protected $fillable = [
        'order_id',
        'pack',
        'amount',
        'status',
    ];

}