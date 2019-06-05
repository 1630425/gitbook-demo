require("shelljs/global");

run();

function run() {
    if (!which("git")) {
        echo("Sorry, this script requires git");
        exit(1);
    } else {
        echo("======================CP Begin======================");
        //cd("1630425.github.io-s");
        echo("----------------------CP Files----------------------");
        //cp('-u', 'themes-archer_config.yml', 'themes/archer/_config.yml');
        cp('themes-archer_config.yml', 'themes/archer/_config.yml');
        cp('themes-archer-source-avatar-Misaka.jpg', 'themes/archer/source/avatar/Misaka.jpg');
        echo("======================CP Complete======================");
    }
}
