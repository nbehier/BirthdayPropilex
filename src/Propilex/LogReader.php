<?php

namespace Propilex;

class LogReader
{
    public static function getActivities($app)
    {
        $activities = array();
        
        if (isset($app['monolog'] ) ) {
            $logFile = @fopen(realpath($app['monolog.logfile'] ), "r");
            if ($logFile ) {
                while ( ($line = fgets($logFile, 4096)) !== false) {
                    if (substr($line, 22, 13) == 'birthday.INFO' 
                    	&& (strpos($line, '>') === false && strpos($line, '<') === false) ) {
                        
	                    $activity = array();
	                    $activity['date'] = strtotime(substr($line, 1, 19) );
	                    $activity['message'] = substr($line, 37, -6);
	                    if (strpos($activity['message'], 'Update User') == 0 ) {
	                    	$activity['type'] = 'updateuserinformation';
	                    }
	                    $activities[] = $activity;
                    }
                }
                if (!feof($logFile) ) {
                    echo 'error';
                }
                fclose($logFile);
            }
        }
        
        return $activities;
    }
}