$(document).ready(function() {
    $('.btnChat').click(function() {
        const num = $('#number').val();
        if (num)
            window.location = `https://api.whatsapp.com/send?phone=${num}`
        else 
            alert('Number Empty')

        return
    })
})