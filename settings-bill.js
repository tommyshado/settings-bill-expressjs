export default () => {

    let smsCost;
    let callCost;
    let warningLevel;
    let criticalLevel;

    let actionList = [];

    let sendSettingsValues = false;

    const setSettings = settings => {
        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = Number(settings.warningLevel);
        criticalLevel = Number(settings.criticalLevel);

        sendSettingsValues = true;
    }

    const getSettings = () => {
        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        };
    };

    const recordAction = action => {

        let cost = 0;

        // when the variable sendSettingsValues is truthy and costs are greater than 0 then...
        if (smsCost > 0 && callCost > 0 && sendSettingsValues) {
            
            // send the values
            if (action === 'sms') {
                cost = smsCost;
            }
            
            else if (action === 'call') {
                cost = callCost;
            };
        }

        actionList.push({
            type: action,
            cost,
            timestamp: new Date()
        });
    }

    const actions = () => actionList;

    const actionsFor = type => {
        const filteredActions = [];

        // loop through all the entries in the action list 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // add the action to the list
                filteredActions.push(action);
            }
        }

        return filteredActions;

        // return actionList.filter((action) => action.type === type);
    }

    const getTotal = type => {
        let total = 0;
        // loop through all the entries in the action list 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // if it is add the total to the list
                total += action.cost;
            }
        }
        return total;

        // the short way using reduce and arrow functions

        // return actionList.reduce((total, action) => { 
        //     let val = action.type === type ? action.cost : 0;
        //     return total + val;
        // }, 0);
    }

    const grandTotal = () => getTotal('sms') + getTotal('call');

    const totals = () => {
        let smsTotal = getTotal('sms');
        let callTotal = getTotal('call');

        return {
            smsTotal,
            callTotal,
            grandTotal: grandTotal()
        };
    };

    const hasReachedWarningLevel = () => {
        const total = grandTotal();
        const reachedWarningLevel = total >= warningLevel
            && total < criticalLevel;

        return reachedWarningLevel;
    }

    const hasReachedCriticalLevel = () => {
        const total = grandTotal();
        return total >= criticalLevel;
    }

    const classNames = () => {
        if (hasReachedCriticalLevel()) {
            return "danger";
        } else if (hasReachedWarningLevel()) {
            return "warning";
        };
    };

    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        hasReachedWarningLevel,
        hasReachedCriticalLevel,
        classNames
    };
};