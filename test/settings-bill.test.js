import assert from "assert";
import settingsBill from "../settings-bill.js";

describe('settings-bill', () => {

    let SettingsBill;

    beforeEach(() => {
        SettingsBill = settingsBill();
    });

    it('should be able to record calls', function(){
        SettingsBill.setSettings({
            smsCost: 2.25,
            callCost: 4.35,
            warningLevel: 20,
            criticalLevel: 35
        })

        SettingsBill.recordAction('call');
        assert.equal(1, SettingsBill.actionsFor('call').length);
    });

    it('should be able to set the settings', function(){
        SettingsBill.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        });

        assert.deepEqual({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        }, SettingsBill.getSettings())


    });

    it('should calculate the right totals', function(){
        SettingsBill.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        });

        SettingsBill.recordAction('call');
        SettingsBill.recordAction('sms');

        assert.equal(2.35, SettingsBill.totals().smsTotal);
        assert.equal(3.35, SettingsBill.totals().callTotal);
        assert.equal(5.70, SettingsBill.totals().grandTotal);

    });

    it('should calculate the right totals for multiple actions', function(){
        SettingsBill.setSettings({
            smsCost: 2.35,
            callCost: 3.35,
            warningLevel: 30,
            criticalLevel: 40
        });

        SettingsBill.recordAction('call');
        SettingsBill.recordAction('call');
        SettingsBill.recordAction('sms');
        SettingsBill.recordAction('sms');

        assert.equal(4.70, SettingsBill.totals().smsTotal);
        assert.equal(6.70, SettingsBill.totals().callTotal);
        assert.equal(11.40, SettingsBill.totals().grandTotal);

    });

    it('should know when warning level reached', function(){
        SettingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        SettingsBill.recordAction('call');
        SettingsBill.recordAction('sms');

        assert.equal(true, SettingsBill.hasReachedWarningLevel());
    });

    it('should know when critical level reached', function(){
        SettingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        SettingsBill.recordAction('call');
        SettingsBill.recordAction('call');
        SettingsBill.recordAction('sms');

        assert.equal(true, SettingsBill.hasReachedCriticalLevel());

    });
});