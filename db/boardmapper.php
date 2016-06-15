<?php

namespace OCA\Deck\Db;

use OCP\AppFramework\Db\Entity;
use OCP\IDb;
use OCP\AppFramework\Db\Mapper;


class BoardMapper extends Mapper {

    public function __construct(IDb $db) {
        parent::__construct($db, 'deck_boards', '\OCA\Deck\Db\Board');
    }


    /**
     * @throws \OCP\AppFramework\Db\DoesNotExistException if not found
     * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException if more than one result
     */
    public function find($id) {
        $sql = 'SELECT * FROM `*PREFIX*deck_boards` ' .
            'WHERE `id` = ?';
        return $this->findEntity($sql, [$id]);
    }


    public function findAll($userId, $limit=null, $offset=null) {
        $sql = 'SELECT * FROM `*PREFIX*deck_boards` WHERE `owner` = ?  ORDER BY `title`';
        return $this->findEntities($sql, [$userId], $limit, $offset);
    }

    public function delete(Entity $entity) {
        // FIXME: delete linked elements, because owncloud doesn't support foreign keys for apps
        return parent::delete($entity);
    }
}