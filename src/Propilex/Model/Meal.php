<?php

namespace Propilex\Model;

use Propilex\Model\om\BaseMeal;
use \PropelException;


/**
 * Skeleton subclass for representing a row from the 'meal' table.
 *
 *
 *
 * You should add additional methods to this class to meet the
 * application requirements.  This class will only be generated as
 * long as it does not already exist in the output directory.
 *
 * @package    propel.generator.Propilex.Model
 */
class Meal extends BaseMeal
{
    public function getDayDate()
    {
        return $this->getDate('d');
    }
    
    /**
     * Get index of string ENUM value
     * @param string $v
     * @throws PropelException - if the value is not accepted by this enum
     * @return int
     */
    public static function getTypeIndex($v)
    {
        $valueSet = MealPeer::getValueSet(MealPeer::TYPE);
        $key = array_search($v, $valueSet);
        if ($key === false) {
            throw new PropelException('Unknown stored enum key: ' . $v);
        }
        return $key;
    }
    
    /**
     * Get value of a int key ENUM
     * @param int $v
     * @throws PropelException - if the key is not accepted by this enum
     * @return string
     */
    public static function getTypeValue($v)
    {
        $valueSet = MealPeer::getValueSet(MealPeer::TYPE);
        if (!isset($valueSet[$v])) {
            throw new PropelException('Unknown stored enum key: ' . $v);
        }
        return $valueSet[$v];
    }
}
