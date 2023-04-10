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
        `<h3><img src="/images/calendar-svgrepo-com.svg" alt="時間" class="title_icon"/>${post.Published}</h3><h3><img src="/images/person-svgrepo-com.svg" alt="作者或主辦者" class="title_icon"/>${post.Author}</h3>` +
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

    let weekly = document.querySelector(".weekly");
    if (weekly){
        function changeWeeklyToFitParent(){
            weekly.style.transform = `scale(${weekly.parentElement.clientWidth / 1920})`; 
        }

        window.addEventListener("resize", function(){
            changeWeeklyToFitParent();
        });
        changeWeeklyToFitParent();

        let downloadButton = document.querySelector("#download_weekly");
        downloadButton.addEventListener("click", function(){
            weekly.style.transform = "scale(1)";

            let originalBorder = weekly.style.border;
            weekly.style.border = "0";
            let newWindow = window.open();
            newWindow.document.write("載入中......");
            domtoimage.toPng(weekly)
                .then(function (_) {
                    domtoimage.toPng(weekly)
                        .then(function (dataUrl) {
                        var img = "<img src='" + dataUrl + "'/>"
                        newWindow.document.body.innerText = "";
                        newWindow.document.write(img);
                        weekly.style.border = originalBorder;
                        changeWeeklyToFitParent();
                    });
                });
        });
    }

    let linkContentSameATags = [].slice.apply(document.querySelectorAll("a"))
        .filter(aTag => aTag.getAttribute("href") === aTag.innerText);
    if (linkContentSameATags.length > 0){
        for(let tag of linkContentSameATags){
            tag.classList.add("linkContentSame");
        }
    }
        
});