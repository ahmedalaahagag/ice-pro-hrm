<?php

class ProjectsActionManager extends SubActionManager
{
    public function getSubServiceCategory($req){

        if($_REQUEST['req']=='Commercial'){
        $html='<option value="Apartments">Apartments</option><option value="Banking">Banking</option><option value="Duplexes">Duplexes</option><option value="Hospitality">Hospitality</option><option value="Industrial">Industrial-Urban Planning</option>';
        }
        if($_REQUEST['req']=='Residential'){
        $html='<option value="Offices">Offices</option><option value="Palaces">Palaces</option><option value="Retail">Retail-F&amp;B </option><option value="Retail">Retail-F&amp;B </option><option value="Villas">Villas</option>';
        }
        print_r($html);
        exit;
    }
}