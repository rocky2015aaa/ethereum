var adminWallet = getCookie("walletAddress");

$(document).ready(function () {
    var walletParameters = [
        ['/mtoken/wallet', '_mtoken_wallet'],
        ['/mtoken/owner', '_mtoken_owner'],
        ['/mtoken/manager', '_mtoken_manager'],
        ['/mtoken/canissue', '_mtoken_canissue'],
        ['/mfund/wallet', '_mfund_wallet'],
        ['/mfund/owner', '_mfund_owner'],
        ['/mfund/token', '_mfund_token'],
        ['/mtoken-sale/wallet', '_mtoken_sale_wallet'],
        ['/mtoken-sale/owner', '_mdaico_owner'],
        ['/mtoken-sale/pause', '_mdaico_pause']
    ];

    for (i = 0; i < walletParameters.length; i++) {
        CheckWallet(walletParameters[i][0], walletParameters[i][1]);
    }

    CheckGoal();
    CheckHardcap();
    CheckFund();
    CheckTokens();

    $.ajax({
        type: 'GET',
        url: '/temp/wallets',
        success: function (resp) {
            var option;
            var wallets = document.createElement("select");
            wallets.id = "_walletList"
            var i = 0;
            for (; i < resp.length; i++) {
                option = document.createElement("option");
                option.text = resp[i][0];
                option.value = resp[i][1];
                wallets.add(option);
            }

            $("#_walletSelect").append(wallets);
            document.getElementById('_walletAddress').innerHTML = $('#_walletList').val();

            $('#_walletList').change(function () {
                document.getElementById('_walletAddress').innerHTML = $(this).val();
            })
        }
    });

    LoadBeneficiaryInformation();
    LoadSpecialBeneficiaryInformation();
});

// ---------------------------------------------------------

function CheckTokens() {
    $.ajax({
        type: 'GET',
        url: '/mtoken/islimited',
        success: function (resp) {
            document.getElementById('_isLimitEnabled').innerHTML = resp;
        }
    });
}

function disableLimt() {
    var data = {};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/mtoken/disablelimit',
        success: function (resp) {
            CheckTokens();
        },
        error: function (jqXHR, exception) {
            alert("error");
        }
    });
}

function CheckSpecialSaleMinimumAndRate() {
    document.getElementById('_event_rate').innerHTML = CheckPrivateSaleRate($('#_eventSalePayerForGetting').val());
    document.getElementById('_privateSaleMinimumEtherPurchaseDisplay').innerHTML = CheckPrivateSaleMinimum($('#_eventSalePayerForGetting').val());
}

function CheckSpecialSaleMinimumAndRate2() {
    document.getElementById('_special_sale_rate').innerHTML = CheckPrivateSaleRate($('#_paymentWalletAddress').val());
    document.getElementById('_privateSaleMinimumEtherPurchaseDisplay2').innerHTML = CheckPrivateSaleMinimum($('#_paymentWalletAddress').val());
}

function CheckPrivateSaleRate(address) {
    var rate;

    $.ajax({
        type: 'GET',
        url: '/mtoken-sale/private-sale-rate',
        async: false,
        data: {
            payer: address
        },
        success: function (resp) {
           rate = resp;
        }
    });
    
    return rate;
}

function CheckPrivateSaleMinimum(address) {
    var minimum;

    $.ajax({
        type: 'GET',
        url: '/mtoken-sale/private-sale-minimum',
        async: false,
        data: {
            payer: address
        },
        success: function (resp) {
            minimum = resp;
        }
    });

    return minimum;
}

// ----------- Tokens Management ------------

function AddToLimitlist() {
    var data = {};
    data.wallet = $('#_walletAddressForLimitTrans').val();

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/mtoken/addLimitedWallet',
        success: function (data) {
            console.log('success');
            alert('success');
        },
        error: function (jqXHR, exception) {
            alert("error");
        }
    });
}

function RemoveToLimitlist() {
    var data = {};
    data.wallet = $('#_walletAddressForLimitTrans').val();

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/mtoken/removeLimitedWallet',
        success: function (data) {
            console.log('success');
            alert('success');
        },
        error: function (jqXHR, exception) {
            alert("error");
        }
    });
}

function CheckIfInLmitlist() {
    $.ajax({
        url: '/mtoken/isLimitedWallet',
        type: 'get',
        data: {
            wallet: $('#_walletAddressForLimitTrans').val()
        },
        success: function (resp) {
            document.getElementById('_checkIfInLmitlist').innerHTML = resp;
            console.log('success');
            alert('success');
        }
    });
}

//--------------------------------------

function CheckWallet(path, domId) {
    $.ajax({
        type: 'GET',
        url: path,
        success: function (resp) {
            if (resp.toString().includes("0x")) {
                document.getElementById(domId).innerHTML = GetKeccakAddress(resp);
            } else {
                document.getElementById(domId).innerHTML = resp;
            }
        }
    });
}

function CheckGoal() {
    $.ajax({
        type: 'GET',
        url: '/mtoken-sale/goal',
        success: function (resp) {
            document.getElementById('_goal').innerHTML = resp;
        }
    });
}

function CheckHardcap() {
    $.ajax({
        type: 'GET',
        url: '/mtoken-sale/hardcap',
        success: function (resp) {
            document.getElementById('_hardcap').innerHTML = resp;
        }
    });
}

function CheckFund() {
    $.ajax({
        type: 'GET',
        url: '/mtoken-sale/fund',
        success: function (resp) {
            console.log(resp);
            document.getElementById('_fund').innerHTML = resp;
        }
    });
}

function CheckUserMccAmount() {
    CheckMccAmount($('#_walletList').val());
}

function CheckCrowdsaleMccAmount() {
    CheckMccAmount(document.getElementById('_mtoken_sale_wallet').innerHTML);
}

function CheckMemberEtherAmount() {
    CheckEtherAmount($('#_walletList').val());
}

// ----------- User Management --------------

function AddBatchQueue(userId) {
    var success;
    var data = {};
    data.userId = userId;

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/temp2/add-batch-queue',
        async: false,
        success: function (data) {
            console.log('success');
            alert('success');
            success = true;
        },
        error: function (jqXHR, exception) {
            alert("error");
            success = false;
        }
    });

    return success;
}

// ----------- KYC --------------

function GetIfInWhitelist() {
    document.getElementById('_checkIfInWhiltelist').innerHTML = CheckIfInWhitelist($('#_walletAddressForWhitelist').val());
}

function CheckIfInWhitelist(target) {
    var val;
    $.ajax({
        url: '/mtoken-sale/kyc/if-in-whitelist',
        type: 'get',
        data: {
            walletAddress: target
        },
        async: false,
        success: function (resp) {
            console.log('success');
            alert('success');
            if (resp.toString() == "true") {
                val = "true";
            } else {
                val = "false";
            }
        }
    });
    return val;
}

function GetUserList(email) {
    console.log("GetUserList");
    var val;
    $.ajax({
        url: '/temp2/load-investor-list',
        type: 'get',
        data: {
            email: email
        },
        async: false,
        success: function (resp) {
            console.log('success');
            val = resp;
        }
    });
    return val;
}

function AddToWhitelist() {
    var data = {};
    data.target = $('#_walletAddressForWhitelist').val();

    $.ajax({
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/mtoken-sale/kyc/add-to-whitelist',
        success: function (data) {
            console.log('success');
            alert('success');

            var rData = {};
            rData.value = 1;
            rData.wallet = $('#_walletAddressForWhitelist').val();

            $.ajax({
                type: 'PUT',
                data: JSON.stringify(rData),
                contentType: 'application/json',
                url: '/temp2/update-user-iswhitelisted',
                success: function (data) {
                    console.log('success');
                    alert('success');
                },
                error: function (jqXHR, exception) {
                    alert("error");
                }
            });
        },
        error: function (jqXHR, exception) {
            alert("error");
        }
    });
}

function RemoveFromWhitelist() {
    var data = {};
    data.target = $('#_walletAddressForWhitelist').val();

    $.ajax({
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/mtoken-sale/kyc/remove-from-whitelist',
        success: function (data) {
            console.log('success');
            alert('success');

            var rData = {};
            rData.value = 9;
            rData.wallet = $('#_walletAddressForWhitelist').val();

            $.ajax({
                type: 'PUT',
                data: JSON.stringify(rData),
                contentType: 'application/json',
                url: '/temp2/update-user-iswhitelisted',
                success: function (data) {
                    console.log('success');
                    alert('success');
                },
                error: function (jqXHR, exception) {
                    alert("error");
                }
            });
        },
        error: function (jqXHR, exception) {
            alert("error");
        }
    });
}

// ---------------- Crowdsale Management ------------------

function PauseCrowdsale() {
    var data = {};

    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        url: '/mtoken-sale/management/pause-crowdsale',
        success: function (data) {
            document.getElementById('_pauseCrowdsale').innerHTML = "paused";
            console.log('success');
            alert('success');
        },
        error: function (jqXHR, exception) {
            alert("error");
        }
    });
}

function UnpauseCrowdsale() {
    var data = {};

    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        url: '/mtoken-sale/management/unpause-crowdsale',
        success: function (data) {
            CheckTrial();
            document.getElementById('_unpauseCrowdsale').innerHTML = "unpaused";
            console.log('success');
            alert('success');
        },
        error: function (jqXHR, exception) {
            alert("error");
        }
    });
}

function FinalizeCrowdsale() {
    var data = {};

    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        url: '/mtoken-sale/management/finalize-crowdsale',
        success: function (data) {
            document.getElementById('_finalizeCrowdSale').innerHTML = "finalized";
            console.log('success');
            alert('success');
        },
        error: function (jqXHR, exception) {
            alert("error");
        }
    });
}

function StartCrowdsaleTrial() {
    var data = {};
    data.trial = $('#_salesTrials').val();

    $.ajax({
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/mtoken-sale/management/start-crowdsale-trial',
        success: function (data) {
            CheckSalesTrials();
            CheckAvailableTokenToSell();

            document.getElementById('_changeCrowdsaleTrial').innerHTML = "changed";
            console.log('success');
            alert('success');
        },
        error: function (jqXHR, exception) {
            alert("error");
        }
    });
}

function SetSalesInfos() {
    var data = {};
    data.trial = $('#_salesTrials').val();
    data.startTime = $('#_setStartTime').val();
    data.endTime = $('#_setEndTime').val();
    data.rate = $('#_newRate').val();
    data.minETH = $('#_newMinETH').val();

    $.ajax({
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/mtoken-sale/management/set-salesinfo',
        success: function (data) {

            CheckSalesTrials();

            console.log('success');
            alert('success');
        },
        error: function (jqXHR, exception) {
            alert("error");
        }
    });
}

// -------------- Refund -------------------------

function GetIfInWhitelistForRefund() {
    document.getElementById('_checkValidContributor').innerHTML = CheckIfInWhitelist($('#_walletAddressForRefund').val());
}

function RefundByAdmin() {
    var data = {};
    data.walletAddress = $('#_walletAddressForRefund').val();

    $.ajax({
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/mtoken-sale/management/refund-by-admin',
        async: false,
        success: function (data) {
            console.log(data);
            alert('success');
            document.getElementById('_Refund').innerHTML = "Refunded";
        },
        error: function (jqXHR, exception) {
            alert("error");
        }
    });
}

// -------------- Private Sale -------------------

function GetPrivateSaleBuyerMCCNum() {
    $.ajax({
        url: '/mtoken/amount',
        type: 'get',
        data: {
            walletAddress: $('#_walletAddressForPrivateSaleList').val()
        },
        success: function (resp) {
            document.getElementById('_GetPrivateSaleBuyerMCCNum').innerHTML = resp;
        }
    });
}

function CheckIfSmartContractIsDeployed() {
    console.log('CheckIfSmartContractIsDeployed');
    var val;
    $.ajax({
        url: '/temp2/if-smart-contract-deployed',
        type: 'get',
        async: false,
        success: function (resp) {
            console.log('success');
            alert('success');
            if (resp.length > 0) {
                val = resp[0].mng_value;
            }
        }
    });
    return val;
}

function PrivateSalePurchase() {
    var success = SpecialSalePurchase($('#_privateSaleEventPaymentWalletAddress').val(), $('#_privateSaleEventWalletAddress').val(), $('#_privateSaleEventETHAmount').val(), "eth", $('#_privateSaleEventWalletPassword').val());
}


function SpecialSalePurchase(paymentWalletAddress, walletAddress, amount, etherUnit, password) {
    var success;
    console.log('SpecialSalePurchase');
    
    var data = {};
    data.paymentWalletAddress = paymentWalletAddress;
    data.walletAddress = walletAddress;
    data.amount = amount;
    data.etherUnit = etherUnit;
    data.password = password;

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/mtoken-sale/management/private-sale-purchase',
        async: false,
        success: function (data) {
            console.log('success');
            alert('success');
            success = true;
        },
        error: function (jqXHR, exception) {
            alert("error");
            success = false;
        }
    });

    CheckFund();
    return success;
}

function AddPrivateSaleList() {
    var data = {};
    data.payer = $('#_eventSalePayerForSetting').val();
    data.minimum = $('#_privateSaleMinimumEtherPurchaseInput').val();
    data.rate = $('#_privateSaleEventRate').val();

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/mtoken-sale/management/add-private-sale-list',
        success: function (data) {
            console.log(data);
            alert('success');
        },
        error: function (jqXHR, exception) {
            alert("error");
        }
    });
}

// ---------------- DB Management ----------------------

function UpdateUserStatus(email, ethValue, privateEthValue) {
    var success;
    console.log("UpdateUserStatus");
    var data = {};
    data.email = email;
    data.ethValue = ethValue;
    data.privateEthValue = privateEthValue;

    $.ajax({
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/temp2/update-user-info',
        async: false,
        success: function (data) {
            console.log(data);
            alert('success');
            success = true;
        },
        error: function (jqXHR, exception) {
            alert("error");
            success = false;
        }
    });

    return success;
}

function AddUser(user, reg_type) {
    var success;

    console.log("AddUser");
    var data = {};
    data.email = user.email;
    data.name = user.name;
    data.phone = user.phone;
    data.ethWallet = user.ethWallet;
    data.ethValue = user.ethValue;
    data.country = user.country;
    data.regType = reg_type;


    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/temp2/add-user',
        async: false,
        success: function (data) {
            console.log(data);
            alert('success');
            success = true;
        },
        error: function (jqXHR, exception) {
            alert("error");
            success = false;
        }
    });

    return success;
}

function AssignBonusToken(user_id, type, tokens) {
    var success;

    console.log("AssignBonusToken");
    var data = {};
    data.userId = user_id;
    data.type = type;
    data.tokens = tokens;

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/temp2/assign-bonus-token',
        async: false,
        success: function (data) {
            console.log(data);
            alert('success');
            success = true;
        },
        error: function (jqXHR, exception) {
            alert("error");
            success = false;
        }
    });

    return success;
}

function AddUserRole(user_id) {
    var success;

    console.log("addUserRole");
    var data = {};
    data.userId = user_id;

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/temp2/add-user-role',
        async: false,
        success: function (data) {
            console.log(data);
            alert('success');
            success = true;
        },
        error: function (jqXHR, exception) {
            alert("error");
            success = false;
        }
    });

    return success;
}

function LoadSpecialBeneficiaryInformation() {
    $.ajax({
        type: 'GET',
        url: '/temp2/load-special-investor-list',
        success: function (resp) {
            console.log("hello " + resp);
            var tbl = document.createElement("table");
            var tbdy = document.createElement('tbody');

            var tr = document.createElement('tr');

            var td = document.createElement('td');
            var text = document.createTextNode("p_id");
            td.append(text);
            tr.append(td);
            td = document.createElement('td');
            text = document.createTextNode("p_email");
            td.append(text);
            tr.append(td);
            td = document.createElement('td');
            text = document.createTextNode("p_name");
            td.append(text);
            tr.append(td);
            td = document.createElement('td');
            text = document.createTextNode("p_phone");
            td.append(text);
            tr.append(td);
            td = document.createElement('td');
            text = document.createTextNode("p_eth_wallet");
            td.append(text);
            tr.append(td);
            td = document.createElement('td');
            text = document.createTextNode("p_eth_value");
            td.append(text);
            tr.append(td);
            td = document.createElement('td');
            text = document.createTextNode("p_country");
            td.append(text);
            tr.append(td);
            td = document.createElement('td');
            text = document.createTextNode("p_reg_time");
            td.append(text);
            tr.append(td);
            td = document.createElement('td');
            text = document.createTextNode("p_contrib_time");
            td.append(text);
            tr.append(td);
            td = document.createElement('td');
            text = document.createTextNode("p_kyc_credit");
            td.append(text);
            tr.append(td);
            td = document.createElement('td');
            text = document.createTextNode("p_kyc_person");
            td.append(text);
            tr.append(td);
            td = document.createElement('td');
            text = document.createTextNode("p_kyc_eth");
            td.append(text);
            tr.append(td);
            td = document.createElement('td');
            text = document.createTextNode("p_register_and_purchase");
            td.append(text);
            tr.append(td);

            tbdy.append(tr);

            for (var i = 0; i < resp.length; i++) {
                var trContent = document.createElement('tr');

                var tdContent = document.createElement('td');
                tdContent.id = "p_investor_user_id_" + i;
                var textContent = document.createTextNode(resp[i].id);
                tdContent.append(textContent);
                trContent.append(tdContent);
                tdContent = document.createElement('td');
                tdContent.id = "p_investor_email_" + i;
                textContent = document.createTextNode(resp[i].email);
                tdContent.append(textContent);
                trContent.append(tdContent);
                tdContent = document.createElement('td');
                tdContent.id = "p_investor_name_" + i;
                textContent = document.createTextNode(resp[i].name);
                tdContent.append(textContent);
                trContent.append(tdContent);
                tdContent = document.createElement('td');
                tdContent.id = "p_investor_phone_" + i;
                textContent = document.createTextNode(resp[i].phone);
                tdContent.append(textContent);
                trContent.append(tdContent);
                tdContent = document.createElement('td');
                tdContent.id = "p_investor_eth_wallet_" + i;
                textContent = document.createTextNode(resp[i].eth_wallet);
                tdContent.append(textContent);
                trContent.append(tdContent);
                tdContent = document.createElement('td');
                tdContent.id = "p_investor_eth_value_" + i;
                textContent = document.createTextNode(resp[i].eth_value_fromWei);
                tdContent.append(textContent);
                trContent.append(tdContent);
                tdContent = document.createElement('td');
                tdContent.id = "p_investor_country_" + i;
                textContent = document.createTextNode(resp[i].country);
                tdContent.append(textContent);
                trContent.append(tdContent);
                tdContent = document.createElement('td');
                tdContent.id = "p_investor_reg_time_" + i;
                textContent = document.createTextNode(resp[i].reg_time);
                tdContent.append(textContent);
                trContent.append(tdContent);
                tdContent = document.createElement('td');
                tdContent.id = "p_investor_contrib_time_" + i;
                textContent = document.createTextNode(resp[i].contrib_time);
                tdContent.append(textContent);
                trContent.append(tdContent);
                tdContent = document.createElement('td');
                tdContent.id = "p_investor_kyc_credit_" + i;
                textContent = document.createTextNode(resp[i].kyc_credit);
                tdContent.append(textContent);
                trContent.append(tdContent);
                tdContent = document.createElement('td');
                tdContent.id = "p_investor_kyc_person_" + i;
                textContent = document.createTextNode(resp[i].kyc_person);
                tdContent.append(textContent);
                trContent.append(tdContent);
                tdContent = document.createElement('td');
                tdContent.id = "p_investor_kyc_eth_" + i;
                textContent = document.createTextNode(resp[i].kyc_email);
                tdContent.append(textContent);
                trContent.append(tdContent);

                tdContent = document.createElement('td');
                tdContent.style.width = '100px';
                tdContent.id = "p_investor_purchase_" + i;

                var buttonContent = document.createElement("input");
                buttonContent.id = $('#_salesDivision').val() + ";" + resp[i].email + ";" + resp[i].name + ";" + resp[i].phone + ";" + resp[i].eth_wallet + ";" + resp[i].eth_value + ";" + resp[i].country;
                buttonContent.type = "button";
                buttonContent.onclick = function () {
                    console.log(this.id);
                    var params = this.id.split(";");
                    var privateUser = {
                        regType: params[0],
                        email: params[1],
                        name: params[2],
                        phone: params[3],
                        ethWallet: params[4],
                        ethValue: parseInt(params[5]),
                        country: params[6]
                    };
                    console.log(privateUser);
                    var exitstedUser = GetUserList(privateUser.email);
                    if (exitstedUser.length == 0 || privateUser.ethWallet == exitstedUser[0].eth_wallet) {
                        var val = CheckIfSmartContractIsDeployed();
                        console.log(val);
                        var success = true;
                        if (val >= 0) {
                            success = SpecialSalePurchase($('#_paymentWalletAddress').val(), privateUser.ethWallet, privateUser.ethValue, "wei", $('#_paymentWalletPassword').val());
                        }

                        if (success) {
                            if (exitstedUser.length == 0) {
                                console.log(privateUser);
                                if (AddUser(privateUser, parseInt($('#_salesDivision').val())+1)) {
                                    var addedUser = GetUserList(privateUser.email);
                                    console.log(addedUser);
                                    if (AddUserRole(addedUser[0].user_id) && AssignBonusToken(addedUser[0].user_id, 1, "10") && AssignBonusToken(addedUser[0].user_id, 3, "20")) {
                                        document.getElementById(this.id).disabled = true;
                                        document.getElementById(this.id).value = "Registered";
                                    }
                                }
                            } else {
                                var r = confirm(exitstedUser[0].user_id+" 사용자가 맞습니까?");
                                if (r == true) {
                                    console.log(exitstedUser[0].status);
                                    if (UpdateUserStatus(exitstedUser[0].email, exitstedUser[0].eth_value, privateUser.ethValue)) {
                                        console.log(this.id);
                                        document.getElementById(this.id).disabled = true;
                                        document.getElementById(this.id).value = "Updated";
                                    }
                                }
                            }
                        }
                    } else {
                        alert('error');
                    }
                };
                tdContent.append(buttonContent);

                trContent.append(tdContent);

                tbdy.append(trContent);
            }

            tbl.append(tbdy);

            $("#_specialInverstors").append(tbl);
        }
    });
}

function LoadBeneficiaryInformation() {
    var resp = GetUserList();
    console.log("hello " + resp);
    var tbl = document.createElement("table");
    var tbdy = document.createElement('tbody');

    var tr = document.createElement('tr');

    var td = document.createElement('td');
    var text = document.createTextNode("user_id");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("active");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("email");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("name");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("password");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("phone");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("eth_wallet");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("eth_value");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("status");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("insert_date");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("update_date");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("kyc_appid");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("kyc_token");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("lang");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("country");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("propose_key");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("bonus_tokens");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("reg_type");
    td.append(text);
    tr.append(td);
    td = document.createElement('td');
    text = document.createTextNode("is_whitelisted");
    td.append(text);
    tr.append(td);

    tbdy.append(tr);

    for (var i = 0; i < resp.length; i++) {
        var trContent = document.createElement('tr');

        var tdContent = document.createElement('td');
        tdContent.id = "_investor_user_id_" + i;
        var textContent = document.createTextNode(resp[i].user_id);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td');
        tdContent.id = "_investor_active_" + i;
        textContent = document.createTextNode(resp[i].active);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td');
        tdContent.id = "_investor_email_" + i;
        textContent = document.createTextNode(resp[i].email);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td');
        tdContent.id = "_investor_name_" + i;
        textContent = document.createTextNode(resp[i].name);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td');
        tdContent.id = "_investor_password_" + i;
        textContent = document.createTextNode(resp[i].password);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td');
        tdContent.id = "_investor_phone_" + i;
        textContent = document.createTextNode(resp[i].phone);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td');
        tdContent.id = "_investor_eth_wallet_" + i;
        textContent = document.createTextNode(resp[i].eth_wallet);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td');
        tdContent.id = "_investor_eth_value_" + i;
        textContent = document.createTextNode(resp[i].eth_value_fromWei);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td');
        tdContent.id = "_investor_status_" + i;
        textContent = document.createTextNode(resp[i].status);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td');
        tdContent.id = "_investor_insert_date_" + i;
        textContent = document.createTextNode(resp[i].insert_date);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td'); +i;
        tdContent.id = "_investor_update_date_"
        textContent = document.createTextNode(resp[i].update_date);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td'); +i;
        tdContent.id = "_investor_kyc_appid_"
        textContent = document.createTextNode(resp[i].kyc_appid);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td'); +i;
        tdContent.id = "_investor_kyc_token_"
        textContent = document.createTextNode(resp[i].kyc_token);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td'); +i;
        tdContent.id = "_investor_lang_"
        textContent = document.createTextNode(resp[i].lang);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td'); +i;
        tdContent.id = "_investor_country_"
        textContent = document.createTextNode(resp[i].country);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td'); +i;
        tdContent.id = "_investor_propose_key_"
        textContent = document.createTextNode(resp[i].propose_key);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td'); +i;
        tdContent.id = "_investor_bonus_tokens_"
        textContent = document.createTextNode(resp[i].bonus_tokens);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td'); +i;
        tdContent.id = "_investor_reg_type_"
        textContent = document.createTextNode(resp[i].reg_type);
        tdContent.append(textContent);
        trContent.append(tdContent);
        tdContent = document.createElement('td'); +i;
        tdContent.id = "_investor_is_whitelisted_"
        textContent = document.createTextNode(resp[i].is_whitelisted);
        tdContent.append(textContent);
        trContent.append(tdContent);

        tdContent = document.createElement('td');
        tdContent.style.width = '100px';
        tdContent.id = "_investor_confirmation_" + i;

        if (resp[i].status == 5) {
            var buttonContent = document.createElement("input");
            buttonContent.id = resp[i].eth_wallet + "_" + resp[i].user_id;
            buttonContent.type = "button";
            buttonContent.onclick = function () {
                console.log(this.id);
                var params = this.id.split("_");
                if (CheckIfInWhitelist(params[0]) == "false" && AddBatchQueue(params[1])) {
                    document.getElementById(this.id).disabled = true;
                    document.getElementById(this.id).value = "Enqueued";
                }
            };
            tdContent.append(buttonContent);
        }

        trContent.append(tdContent);

        tbdy.append(trContent);
    }

    tbl.append(tbdy);

    $("#_inverstors").append(tbl);
}

function refreshSalesInfo() {
    CheckAvailableTokenToSell();
    CheckFund();
}
