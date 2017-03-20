<?php

class PostRepository {
  public static function getPost($topic_id, $post_id) {
    $pdo = ctx_getpdo();
    $stmt = $pdo->prepare('SELECT revision_no, content FROM posts WHERE topic_id = ? AND post_id = ?');
    $stmt->execute(array($topic_id, $post_id));
    return $stmt->fetch();
  }

  public static function getPostCount() {
    $pdo = ctx_getpdo();
    $result = $pdo->query('SELECT COUNT(*) cnt FROM `posts`')->fetchAll();
    return $result[0]['cnt'];
  }
}