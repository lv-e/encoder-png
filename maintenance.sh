#!/bin/bash
set -e
echo "hi! this is lv encoder for > png < file's mantenance script"

## available commands
publish(){
    
    while true; do

        if [[ `git status --porcelain` ]]; then
            echo "you do have local changes!"
            echo "will now rebuild, commit and publish."
        else
            echo "you don't have local changes. do you really need a new version?"
            echo "anyway, will now rebuild, commit (because of /lib) and publish."
        fi
        
        read -p "it's that okay (y/n)? " yn; echo "--"

        case $yn in
            [Yy]* ) 

                echo "publishing a new npm version. what's the commit message?"
                read commit_message; echo "--"

                rebuild
                git add .
                git commit --allow-empty -m "$commit_message"

                yarn config set version-tag-prefix "v"
                yarn version --non-interactive --patch
                yarn publish --non-interactive
                
                echo "there you go!"

                break;;
            [Nn]* )
                echo "ok! bye."
                exit;;
            * ) 
                echo "Please answer yes or no."
        esac
    done
}

rebuild(){
    rm -rf ./lib
    tsc -p .
}

## what should we do?

 while true; do

        echo "available options are:"
        echo "1) publish"
        read -p "choose one: " opt; echo "--"

        case $opt in
            1) publish; break;;
            * ) echo "ok! bye."; exit;;
        esac
done

