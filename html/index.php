<?php
require_once(__DIR__ . "/../init.php");
require_once(__DIR__ . "/../libs/functions.class.inc.php");

$version = functions::validate_version();
$db = functions::get_database($version);
$anno = get_anno($db);
$anno_html = get_anno_html($anno);


$twig_variables = array("anno_html" => $anno_html);
$loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig = new \Twig\Environment($loader);

$html = $twig->render("index.html.twig", $twig_variables);

echo $html;




function get_anno($db) {
    $anno = array();
    $sql = "SELECT * FROM annotations";
    $sth = $db->prepare($sql);
    $sth->execute();
    while ($row = $sth->fetch()) {
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

