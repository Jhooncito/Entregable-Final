$(document).ready(function () {
  $(".tab").click(function () {
    $(".tab").removeClass("active");
    $(".panel").removeClass("active").attr("hidden", true);

    $(this).addClass("active");
    const target = $(this).data("target");
    $("#" + target).addClass("active").removeAttr("hidden");
  });
});

