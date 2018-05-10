var browser = browser || this.browser;

$(document).ready(function(){
    var __slack_save__waiting = false;
    var __slack_save__start = -1;
    var __slack_save__end = -1;
    var __slack_save__header = "<meta charset=utf-8><style>.c-virtual_list__item{border:none;padding:5px}.c-message__sender_link{text-decoration:none;color:#000;font-weight:700;display:block;margin-bottom:5px;pointer-events:none}.c-message{display:flex;flex-direction:row;font-family:sans-serif;font-size:14px}.c-message .c-message__content{flex:1}.c-message.c-message--adjacent{padding-left:50px}.c-message .c-message__gutter{flex-basis:50px}.c-message.c-message--adjacent .c-message__gutter{display:none}.c-avatar__image{width:32px;height:32px}.c-message_list__day_divider,.c-message_list__day_divider__label{display:none}.emoji-sizer{text-indent:-99999px;width:22px;height:22px;display:inline-block;background-size:contain;background-repeat:none}.c-custom_status,.c-file__actions,.c-message__comment,.c-message__file_meta,.c-timestamp{display:none}.c-message__image_container img{width:100%;height:100%;border:1px solid #ccc}</style>";

    console.log("PLUGIN LOADED");

    if (!$("#btn_save_messages").length) {
        $(".channel_header .flex_header #search_container").before('<button type="button" id="btn_save_messages" class="channel_header_icon btn_unstyle ts_tip ts_tip_bottom ts_tip_rightish"><span class="ts_tip_tip">Save messages</span><ts-icon class="ts_icon_bolt" aria-hidden="true"></ts-icon></button>');
    }

    $("#btn_save_messages").on("click", function() {
        console.log("SAVE ACTIVATED");
        if (!__slack_save__waiting) {
            __slack_save__waiting = true;
            __slack_save__start = -1;
            __slack_save__end = -1;
            $(this).addClass("activated");
        }
    });

    $("body").on("click", ".c-virtual_list__item", function() {
        if (__slack_save__waiting) {
            var current = $(this);
            console.log("CLIECKED ON", current);

            if (__slack_save__start === -1) {
                __slack_save__start = current.index() - 1;
                current.addClass("__slack-save_marked");
            } else if (__slack_save__end === -1) {
                __slack_save__end = current.index() + 1;
                current.addClass("__slack-save_marked");
            }
            if (__slack_save__start !== -1 && __slack_save__end !== -1) {
                var list = $(".c-virtual_list__item").slice(__slack_save__start, __slack_save__end);
                var output = "";
                $.each(list, function(idx, item) {
                    output += item.outerHTML;
                    if (!$(item).hasClass("__slack-save_marked")) {
                        $(item).addClass("__slack-save_marked");
                    }
                });

                $("#btn_save_messages").removeClass("activated");

                output = __slack_save__header + output;

                browser.runtime.sendMessage(output);

                console.log("Finished", output);

                setTimeout(function() {
                    $(".__slack-save_marked").removeClass("__slack-save_marked");
                }, 1000);

                __slack_save__waiting = false;
            }
        }
    });
});
