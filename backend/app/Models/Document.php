<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class);
    }



    public function sub_document()
    {
        return $this->hasMany(Document::class);
    }

    protected $fillable = [
        "file",
        "is_public",
        "is_archived",
        "keywords",
        "document_shared_user",
        "document_share_group"
    ];

    protected $connection = "mongodb";
}
