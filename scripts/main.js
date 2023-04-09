const CURRENT_TAG_CLASS = "current";
const TAG_SEARCH_PARAMS_KEY = "tag";

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
        `<a href='${post.Link}' class="thumbnail"><img src="${post.Thumbnail}" alt="${post.Title}" loading="lazy" /></a>` +
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
        function changeTag(selectedTag, isFirst = false){
            if (!isFirst) {
                if (selectedTag.dataset.url){
                    let searchParams = new URLSearchParams();
                    searchParams.set(TAG_SEARCH_PARAMS_KEY, selectedTag.dataset.url); 
                    window.history.pushState('', '', `/?${searchParams}`);
                }
                else {
                    window.history.pushState('', '', '/');
                }
            }
            currentTag = selectedTag.innerText;

            for(let tag of tags){
                tag.classList.remove(CURRENT_TAG_CLASS);
            }
            selectedTag.classList.add(CURRENT_TAG_CLASS);

            printPosts(currentTag == tags[0].innerText
                ? posts
                : posts.filter(post => post.Tags.includes(currentTag)));
        }

        function changeCurrentSelectedTag() {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const currentTagUrl = urlParams.get(TAG_SEARCH_PARAMS_KEY);
            const selectedTag = [].slice.apply(tags).filter(tag => tag.dataset.url === currentTagUrl);
            changeTag(selectedTag.length > 0 ? selectedTag[0] : tags[0], true);
        }
        changeCurrentSelectedTag();

        window.addEventListener("popstate", function(event) {
            changeCurrentSelectedTag();
        });

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