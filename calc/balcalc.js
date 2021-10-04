var bullet_params = new Array();
var bullets = 1;
var max_bullets = 0;
var calibers_list = new Array();
var bullets_list = new Array();
var user_data_calibers = new Array();
var user_data_bullets = new Array();
var user_data_params = new Array();
function toggle_atm() {
    if (!document.getElementsByName('cb_atm')[0].checked) {
        document.getElementsByName('txt_temp')[0].disabled = 'disabled';
        document.getElementsByName('txt_alt')[0].disabled = 'disabled';
        document.getElementsByName('txt_pressure')[0].disabled = 'disabled';
        document.getElementsByName('txt_humidity')[0].disabled = 'disabled'
    } else {
        document.getElementsByName('txt_temp')[0].disabled = '';
        document.getElementsByName('txt_alt')[0].disabled = '';
        document.getElementsByName('txt_pressure')[0].disabled = '';
        document.getElementsByName('txt_humidity')[0].disabled = ''
    }
}
function density() {
    var i = 0;
    var dia = parseFloat(document.getElementsByName('dia')[0].value);
    var grains = parseFloat(document.getElementsByName('txt_weight')[0].value);
    var sd = Math.round(grains / ((dia / 2) * (dia / 2) * 3.141597 * 8918.09688) * 1000) / 1000;
    while (!document.getElementsByName('shape')[i].checked) {
        i += 1
    }
    var shape = document.getElementsByName('shape')[i].value;
    var bc = Math.round(sd * shape * 1000) / 1000;
    return bc
}
; function calc_bc() {
    var dia = parseFloat(document.getElementsByName('dia')[0].value);
    var grains = parseFloat(document.getElementsByName('txt_weight')[0].value);
    if ((dia >= 1) || (dia <= 0) || isNaN(dia)) {
        alert("Please enter a bullet diameter more than 0 and less than 1")
    } else {
        if ((grains < 10) || isNaN(dia)) {
            alert("Please enter a bullet weight greater than 10 grains")
        } else {
            var bc = density();
            document.getElementsByName('txt_bc_calc')[0].value = bc.toString();
            document.getElementsByName('txt_bc')[0].value = bc.toString()
        }
    }
}
function try_calc_bc() {
    var dia = parseFloat(document.getElementsByName('dia')[0].value);
    var grains = parseFloat(document.getElementsByName('txt_weight')[0].value);
    if ((dia > 0) && (dia < 1) && !isNaN(dia) && (grains >= 10)) {
        calc_bc()
    }
}
function change_caliber(id) {
    var caliber = $('#sel_caliber' + id.toString()).val();
    $("select[id=sel_name" + id.toString() + "] > option").remove();
    for (var i = 0; i < bullets_list.length; i++) {
        if (bullets_list[i][1] == caliber) {
            $('#sel_name' + id.toString()).append($('<option>', {
                value: bullets_list[i][0]
            }).text(bullets_list[i][2]))
        }
    }
    ; change_name(id)
}
function change_name(id) {
    var bullet_params_id = $('#sel_name' + id.toString()).val();
    i = 0;
    while ((i < bullets_list.length) && (bullets_list[i][0] != bullet_params_id)) {
        i++
    }
    var params = bullets_list[i];
    $('#txt_weight' + id.toString()).val(params[3]);
    $('#txt_bc' + id.toString()).val(params[4] / 1000);
    $('#txt_mv' + id.toString()).val(params[5])
}
function toggle_hide_bullet_images() {
    for (i = 2; i < max_bullets; i++) {
        $('#img_hide_bullet_input' + i.toString()).hide()
    }
    $('#img_hide_bullet_input' + bullets.toString()).show()
}
function show_next_bullet_input() {
    if (bullets < max_bullets) {
        bullets++;
        $('#div_bullet_input' + bullets.toString()).show()
    }
    if (bullets < max_bullets) {
        $('#div_show_next_bullet').show()
    } else {
        $('#div_show_next_bullet').hide()
    }
    toggle_hide_bullet_images();
    $('#bullets').val(bullets.toString())
}
function hide_current_bullet_input() {
    $('#div_bullet_input' + bullets.toString()).hide();
    bullets--;
    toggle_hide_bullet_images();
    $('#bullets').val(bullets.toString())
}
function toggle_advanced_options() {
    if ($('#div_advanced').is(':visible')) {
        $('#div_advanced').hide()
    } else {
        $('#div_advanced').show()
    }
}
function get_all_bullets(bullets_no) {
    max_bullets = bullets_no;
    $.post('get_bullet_params.php', {
        action: 'list_all'
    }, function (json_data) {
        var data = $.parseJSON(json_data);
        var calibers_data = data.calibers;
        var bullets_data = data.bullets;
        var i = 1;
        $.each(calibers_data, function (index, value) {
            calibers_list.push(value);
            i++
        });
        $.each(bullets_data, function (index, value) {
            bullets_list.push(new Array(value.id, value.bcaliber, value.name, value.grains, value.coeff, value.velocity))
        });
        populate_bcaliber_lists();
        if ($('#projectile_params').length > 0) {
            pp = $.parseJSON($("<div/>").html($('#projectile_params').val()).text());
            for (var i = 1; i < pp.bullets_entered; i++) {
                show_next_bullet_input()
            }
            $.each(pp.calibers, function (index, value) {
                $('#sel_caliber' + index.toString() + ' option[value="' + value + '"]').attr("selected", "selected");
                change_caliber(index)
            });
            $.each(pp.bullets, function (index, value) {
                $('#sel_name' + index.toString() + ' option[value=' + value + ']').attr("selected", "selected");
                change_name(index);
                $('#txt_weight' + index.toString()).val(pp.weight[index]);
                $('#txt_bc' + index.toString()).val(pp.bc[index]);
                $('#txt_mv' + index.toString()).val(pp.mv[index])
            })
        }
    })
}
function populate_bcaliber_lists() {
    for (var i = 1; i <= max_bullets; i++) {
        $("select[id=sel_caliber" + i.toString() + "] > option").remove();
        for (var j = 0; j < calibers_list.length; j++) {
            $('#sel_caliber' + i.toString()).append($('<option>', {
                value: calibers_list[j]
            }).text(calibers_list[j]))
        }
        change_caliber(i)
    }
}
