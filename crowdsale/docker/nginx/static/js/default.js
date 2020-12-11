$(document).ready(function () {
    CheckSalesTrials();
    CheckFundState();

    CheckAvailableTokenToSell();
});

function CheckSalesTrials() {
    $.ajax({
        type: 'GET',
        url: '/mtoken-sale/trial',
        success: function (resp) {
            document.getElementById('_trial').innerHTML = resp;

            if (resp >= '0') {
                CheckSalesInfos();
            }
        }
    });
}
function CheckFundState() {
    $.ajax({
        type: 'GET',
        url: '/mfund/state',
        success: function (resp) {
            document.getElementById('_fundstate').innerHTML = resp;
        }
    });
}
function CheckSalesInfos() {
    $.ajax({
        type: 'GET',
        url: '/mtoken-sale/infos',
        success: function (resp) {
            console.log(resp);
            document.getElementById('_saleStartDate').innerHTML = resp[0];
            document.getElementById('_saleEndDate').innerHTML = resp[1];
            document.getElementById('_rate').innerHTML = resp[2];
            document.getElementById('_minETH').innerHTML = resp[3];
        }
    });
    $.ajax({
        type: 'GET',
        url: '/mtoken-sale/isfinalized',
        success: function (resp) {
            document.getElementById('_isfinalized').innerHTML = resp;
        }
    });
    $.ajax({
        type: 'GET',
        url: '/mtoken-sale/isclosed',
        success: function (resp) {
            document.getElementById('_isclosed').innerHTML = resp;
        }
    });
}

function CheckMccAmount(address) {
    $.ajax({
        url: '/mtoken/amount',
        type: 'get',
        data: {
            walletAddress: address
        },
        success: function (resp) {
            document.getElementById('_chkMccAmount').innerHTML = resp;
        }
    });
}

function CheckEtherAmount(address) {
    $.ajax({
        url: '/mtoken-sale/ether-amount',
        type: 'get',
        data: {
            walletAddress: address
        },
        success: function (resp) {
            document.getElementById('_chkEtherAmount').innerHTML = resp;
        }
    });
}

function CheckAvailableTokenToSell() {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: '/mtoken-sale/available-token-to-sell',
        success: function (resp) {
            document.getElementById('_token_remains').innerHTML = resp;
        }
    });
}

// --------- Utility ---------------------

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function GetKeccakAddress(address) {
    var newAddress;
    $.ajax({
        url: '/keccak-address',
        type: 'get',
        async: false,
        data: {
            walletAddress: address
        },
        success: function (resp) {
            newAddress = resp;
        }
    });

    return newAddress;
}
