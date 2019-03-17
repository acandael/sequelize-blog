var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
var Article = require('../models').Article;

/* GET articles listing. */
router.get('/', function(req, res, next) {
  Article.findAll().then(function(articles) {
    res
      .render('articles/index', {
        articles: articles,
        title: 'My Awesome Blog'
      })
      .catch(function(err) {
        res.send(500);
      });
  });
});

/* POST create article. */
router.post('/', function(req, res, next) {
  Article.create(req.body)
    .then(function(article) {
      res.redirect('/articles/' + article.id);
    })
    .catch(function(err) {
      if (err.name === 'SequelizeValidationError') {
        res.render('articles/new', {
          article: Article.build(req.body),
          title: 'New Article',
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(function(err) {
      res.send(500);
    });
});

/* Create a new article form. */
router.get('/new', function(req, res, next) {
  res.render('articles/new', {
    article: Article.build(),
    title: 'New Article'
  });
});

/* Edit article form. */
router.get('/:id/edit', function(req, res, next) {
  Article.findByPk(req.params.id)
    .then(function(article) {
      if (article) {
        res.render('articles/edit', {
          article: article,
          title: 'Edit Article'
        });
      } else {
        res.status(404).send('Not found');
      }
    })
    .catch(function(err) {
      res.send(500);
    });
});

/* Delete article form. */
router.get('/:id/delete', function(req, res, next) {
  Article.findByPk(req.params.id)
    .then(function(article) {
      if (article) {
        res.render('articles/delete', {
          article: article,
          title: 'Delete Article'
        });
      } else {
        res.status(404).find('Not found');
      }
    })
    .catch(function(err) {
      res.send(500);
    });
});

/* GET individual article. */
router.get('/:id', function(req, res, next) {
  Article.findByPk(req.params.id).then(function(article) {
    if (article) {
      res.render('articles/show', {
        article: article,
        title: article.title,
        publishedAt: dateFormat(
          article.createdAt,
          'dddd, mmmm dS, yyyy, h:MM TT'
        )
      });
    } else {
      res.status('404').send('Not found');
    }
  });
});

/* PUT update article. */
router.put('/:id', function(req, res, next) {
  Article.findByPk(req.params.id)
    .then(function(article) {
      if (article) {
        return article.update(req.body);
      } else {
        res.render(404);
      }
    })
    .then(function(article) {
      res.redirect('/articles/' + article.id);
    })
    .catch(function(err) {
      if (err.name === 'SequelizeValidationError') {
        var article = Article.build(req.body);
        article.id = req.params.id;

        res.render('articles/edit', {
          article: article,
          title: 'Edit Article',
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(function(err) {
      res.send(500);
    });
});

/* DELETE individual article. */
router.delete('/:id', function(req, res, next) {
  Article.findByPk(req.params.id)
    .then(function(article) {
      if (article) {
        return article.destroy();
      } else {
        res.render(404);
      }
    })
    .then(function() {
      res.redirect('/articles');
    });
});

module.exports = router;
