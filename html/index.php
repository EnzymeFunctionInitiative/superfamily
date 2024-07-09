<?php
require_once(__DIR__ . "/../init.php");
require_once(__LIB_DIR__ . "/functions.class.inc.php");
require_once(__LIB_DIR__ . "/database.class.inc.php");

$version = functions::validate_version();
$db = new database($version);
$anno = get_anno($db);
$anno_html = get_anno_html($anno);


$twig_variables = array("anno_html" => $anno_html);

$intro_pages = array(
    array('id' => 'background', 'file' => 'intro/site_specific/local/background.html.twig', 'name' => 'Background', 'default' => 'true'),
    array('id' => 'cur_release', 'file' => 'intro/site_specific/local/cur_release.html.twig', 'name' => 'Current Release'),
    array('id' => 'subgroups', 'file' => 'intro/site_specific/local/subgroups.html.twig', 'name' => 'Subgroups'),
    array('id' => 'func_subgroups', 'file' => 'intro/site_specific/local/func_subgroups.html.twig', 'name' => 'Functionally Diverse Subgroups'),
    array('id' => 'explore', 'file' => 'intro/site_specific/local/explore.html.twig', 'name' => 'Explore Pages'),
    array('id' => 'search', 'file' => 'intro/site_specific/local/search.html.twig', 'name' => 'Search Functions'),
);
$twig_variables["pages"] = $intro_pages;


$loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig = new \Twig\Environment($loader);

$html = $twig->render("index.html.twig", $twig_variables);

echo $html;




function get_anno($db) {
    $sql = "SELECT * FROM annotations";
    $results = $db->query($sql);
    if (!$results)
        return array();
    $anno = array();
    foreach ($results as $row) {
        $doi = explode("`", $row["doi"]);
        array_push($anno, array($row["uniprot_id"], $doi));
    }
    return $anno;
}

function get_anno_html($anno) {
    $html = <<<HTML
<table class="table w-auto">
    <thead>
        <td>UniProt ID</td>
        <td>DOI</td>
    </thead>
HTML;
    for ($i = 0; $i < count($anno); $i++) {
        $id = $anno[$i][0];
        $doi = join("<br>\n",
            array_map(function($a) { return "<a href=\"$a\">$a</a>"; }, $anno[$i][1]));
        $html .= <<<HTML
    <tr>
        <td>$id</td>
        <td>$doi</td>
    </tr>
HTML;
    }
    $html .= "</table>";
    return $html;
}

