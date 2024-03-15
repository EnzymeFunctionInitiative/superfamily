
////////////////////////////////////////////////////////////////////////////////////////////////////
// PROGRESS UI
//
function Progress(progressDiv) {
    this.progress = progressDiv;
}
Progress.prototype.start = function() {
    this.progress.show();
}
Progress.prototype.stop = function() {
    this.progress.hide();
}



function ProgressBarTimer(progressDiv, numSteps, duration) {
    this.progress = progressDiv;
    this.numSteps = numSteps;
    this.duration = duration;
    this.value = 0;
    this.timerId = 0;
}
ProgressBarTimer.prototype.start = function() {
    this.progress.show();
    var stepTime = 1000 * this.duration / this.numSteps;
    var that = this;
    var progressFn = function() {
        that.value += 100 / that.numSteps;
        $("#searchSeqProgressBar").css("width", that.value+"%").attr("aria-valuenow", that.value);    
    };
    this.timerId = setInterval(progressFn, stepTime);
}
ProgressBarTimer.prototype.stop = function() {
    this.progress.hide();
    clearInterval(this.timerId);
    this.value = 0;
    $("#searchSeqProgressBar").css("width", "0%").attr("aria-valuenow", 0);
}


