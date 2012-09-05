<?php

$app = require_once __DIR__ . '/config/config.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/*
$users = Propilex\Model\UserQuery::selectUsersList();
$usersRole = array();
foreach ($users as $user ) {
    if ($user['id'] == 0) {
    	$usersRole[] = array('ROLE_ADMIN', '');
    }
    else {
        $usersRole[] = array('ROLE_USER', '');
    }
}

$app['security.firewalls'] = array(
    'admin' => array(
        'pattern' => '^/private', 
        'http' => true, 
        'users' => $usersRole
    )
);
*/

/**
 * @see http://silex.sensiolabs.org/doc/cookbook/json_request_body.html
 */
$app->before(function (Request $request) {
    if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
        $data = json_decode($request->getContent(), true);

        // filter values
        foreach ($data as $k => $v) {
            if (false === array_search($k, array('Id', 'Title', 'Body', 'Firstname', 'Lastname', 'Location_Id', 'Description', 'Email'))) {
                unset($data[$k]);
            }
        }

        $request->request->replace(is_array($data) ? $data : array());
    }
});

// Put user token on twig template
/*
$app->before(function (Request $request) use ($app) {
    $token = $app['security']->getToken();
    if (null !== $token) {
        $user = $token->getUser();
        // @todo Put variable on twig template
    }
});
*/

/**
 * Entry point
 */
$app->get('/', function() use ($app) {
    $users = Propilex\Model\UserQuery::selectUsers();
    $locations = array(
    	array('key' => 1, 'label' => 'Tente'),
    	array('key' => 2, 'label' => 'Chambre')
    );
    $meals = array(
    	array('key' => '212', 'label' => 'Ven soir'), 
    	array('key' => '013', 'label' => 'Sam matin'), 
    	array('key' => '113', 'label' => 'Sam midi'), 
    	array('key' => '213', 'label' => 'Sam soir'), 
    	array('key' => '014', 'label' => 'Dim matin'), 
    	array('key' => '114', 'label' => 'Dim midi'), 
    	array('key' => '214', 'label' => 'Dim soir')
    );
    $answers = array(
    	array('key' => 0, 'label' => 'En attente de réponse'),
    	array('key' => 1, 'label' => 'Présent'),
    	array('key' => 2, 'label' => 'Absent')
    );
    return $app['twig']->render('index.html.twig', array(
    	'users' => json_encode($users),
    	'locations' => json_encode($locations),
    	'meals' => json_encode($meals),
    	'answers' => json_encode($answers)
    ));
});


/**
 * Security page
 */
$app->get('/private', function() use ($app) {
    $users = Propilex\Model\UserQuery::selectUsersList();
    return $app['twig']->render('private.html.twig', array('users' => $users) );
});
    
/**
 * Register a REST controller to manage documents
 */
$app->mount('/users', new Propilex\Provider\UserController(
	'user', '\Propilex\Model\User', 'getUpdatedAt'
));

/**
 * Get users activities
 */
$app->get('/list-activities', function() use ($app) {
    $activities = Propilex\LogReader::getActivities($app);
    return $app['twig']->render('activities.html.twig', array(
        'activities' => $activities
    ));
});

/**
 * Get users activities
 */
$app->get('/list-users', function () use($app )
{
    $users = Propilex\Model\UserQuery::selectUsersListOrderByConfirmation();
    return $app['twig']->render('list-users.html.twig', array('users' => $users) );
});

return $app;
