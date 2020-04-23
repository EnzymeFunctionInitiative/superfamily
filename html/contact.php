<?php require_once 'includes/header.inc.php'; 

$twig_contact_variables = array();

$twig_contact_loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig_contact = new \Twig\Environment($twig_contact_loader);

$contact_html = "";
if (file_exists(settings::get_twig_dir() . "/custom/contact.html.twig")) {
        $contact_html = $twig_contact->render("custom/contact.html.twig",$twig_contact_variables);
}
else {
        $contact_html = $twig_contact->render("default/contact.html.twig",$twig_contact_variables);
}

echo $contact_html;



require_once 'includes/footer.inc.php';

?>

