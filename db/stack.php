<?php
// db/author.php
namespace OCA\Deck\Db;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;

class Stack extends Entity implements JsonSerializable {

    public $id;
    protected $title;
    protected $boardId;
    protected $cards = array();
    protected $order;
    public function __construct() {
        $this->addType('id','integer');
        $this->addType('boardId','integer');
        $this->addType('order','integer');

    }
    public function setCards($cards) {
        $this->cards = $cards;
    }
    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'order' => $this->order,
            'boardId' => $this->boardId,
            'cards' => $this->cards,
        ];
    }
}