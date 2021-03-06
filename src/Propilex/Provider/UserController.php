<?php

namespace Propilex\Provider;

use Silex\Application;
use Silex\ControllerCollection;
use Silex\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Propilex\Model\UserQuery;

/**
 * @author NBD
 */
class UserController extends RestController
{

    /**
     * {@inheritdoc}
     */
    public function connect( Application $app )
    {
        $modelName = $this->modelName;
        $prefix = sprintf('rest_controller.%s.', $this->modelName);
        
        if (null !== $this->modelClass) {
            $app[$prefix . 'model_class'] = $this->modelClass;
        }
        
        if (null !== $this->lastModifiedGetter) {
            $app[$prefix . 'last_modified_getter'] = $this->lastModifiedGetter;
        }
        
        if (isset($app[$prefix . 'model_class'])) {
            $app[$prefix . 'query_class'] = $app[$prefix . 'model_class'] . 'Query';
        } else {
            throw new \InvalidArgumentException(sprintf('You have to configure the "%s.model_class" parameter.', $prefix));
        }
        
        $controllers = new ControllerCollection($app['route_factory']);
        
        /**
         * Returns all objects
         */
        $controllers->get('/', function () use($app, $prefix )
        {
            $query = new $app[$prefix . 'query_class']();
            
            return new Response($query->find()->exportTo($app['json_parser']), 200, array(
                'Content-Type' => 'application/json'
            ));
        });
        
        /**
         * Returns a specific object identified by a given id
         */
        $controllers->get('/{id}', function ( $id ) use($app, $prefix, $modelName )
        {
            $query = new $app[$prefix . 'query_class']();
            $object = $query->findPk($id);
            
            if (! $object instanceof $app[$prefix . 'model_class']) {
                throw new NotFoundHttpException(sprintf('%s with id "%d" does not exist.', ucfirst($modelName), $id));
            }
            
            $response = new Response($object->exportTo($app['json_parser']), 200, array(
                'Content-Type' => 'application/json'
            ));
            
            if (isset($app[$prefix . 'last_modified_getter'])) {
                $response->setLastModified($object->$app[$prefix . 'last_modified_getter']());
            }
            
            return $response;
        });
        
        /**
         * Create a new object
         */
        $controllers->post('/', function ( Request $request ) use($app, $prefix )
        {
            $object = new $app[$prefix . 'model_class']();
            $object->fromArray($request->request->all());
            $object->save();
            
            return new Response($object->exportTo($app['json_parser']), 201, array(
                'Content-Type' => 'application/json'
            ));
        });
        
        /**
         * Update a object identified by a given id
         */
        $controllers->put('/{id}', function ( $id, Request $request ) use($app, $prefix, $modelName )
        {
            $query = new $app[$prefix . 'query_class']();
            $object = $query->findPk($id);
            
            if (! $object instanceof $app[$prefix . 'model_class']) {
                throw new NotFoundHttpException(sprintf('%s with id "%d" does not exist.', ucfirst($modelName), $id));
            }
            
            $params = $request->request->all();
            $object->fromArray($params);
            $object->save();
            
            // Update Meals relations
            $object->deleteMeals();
            
            $mealsRef = array();
            foreach($params['Meal'] as $mealRef) {
                $mealType = substr($mealRef, 0, 1);
                $mealDay = substr($mealRef, 1);
                $mealsRef[] = array('type' => $mealType, 'day' => $mealDay);
            }
            $object->addMealByTypeAndDate($mealsRef, $params['Number']);
            
            if (isset($app['monolog'])) {
                $app['monolog']->addInfo(sprintf('Update %s with id %d', ucfirst($modelName), $id));
            }
            
            return new Response($object->exportTo($app['json_parser']), 200, array(
                'Content-Type' => 'application/json'
            ));
        });
        
        /**
         * Delete a object identified by a given id
         */
        $controllers->delete('/{id}', function ( $id ) use($app, $prefix )
        {
            $query = new $app[$prefix . 'query_class']();
            $query->filterByPrimaryKey($id)->delete();
            
            return new Response('', 204, array(
                'Content-Type' => 'application/json'
            ));
        });
        
        
        
        return $controllers;
    }
}