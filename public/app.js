$(document).ready(() => {
    $("btn.save").on("click", (e) => {
        const id = $(e.target).data("id")
        $.ajax("/save/" + id, {
                type: "PUT"
            })
            .then(() => {console.log("SAVED", id)})

    })
})