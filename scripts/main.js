const CURRENT_TAG_CLASS = "current";

function getTagComponent(tag){
    return `<li class="${tag}">${tag}</li>`;
}

function getTagsComponent(tags){
    let result = "";
    for(let tag of tags){
        result += getTagComponent(tag);
    }
    return result;
}

function getPostComponent(post){
    return `<div class="post">` +
        `<a href='${post.Link}' class="thumbnail" style='background-image: url("${post.Thumbnail}")'></a>` +
        `<h3>${post.Published}－${post.Author}</h3>` +
        `<ul>${getTagsComponent(post.Tags)}</ul>` +
        `<h2><a href='${post.Link}'>${post.Title}</a></h2>` +
        `</div>`;
}

function printPosts(posts){
    let postList = document.querySelector(".post_list");

    postList.innerHTML = "";
    for(let post of posts){
        postList.innerHTML += getPostComponent(post);
    }
}


document.addEventListener("DOMContentLoaded", function(){
    let tags = document.querySelectorAll("nav.tags li");
    if (tags.length > 0){
        let currentTag;
        function changeTag(selectedTag){
            currentTag = selectedTag.innerText;

            for(let tag of tags){
                tag.classList.remove(CURRENT_TAG_CLASS);
            }
            selectedTag.classList.add(CURRENT_TAG_CLASS);

            printPosts(currentTag == tags[0].innerText
                ? posts
                : posts.filter(post => post.Tags.includes(currentTag)));
        }
        changeTag(tags[0]);

        for(let tag of tags) {
            tag.addEventListener("click", function(event){
                changeTag(event.target)
            });
        }
    }

    let header = document.querySelector("header");
    if(header){
        header.addEventListener("click", function(event){
            location.assign("/");
        });
    }
});