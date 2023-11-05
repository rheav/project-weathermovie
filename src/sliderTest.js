"use strict";

const queryModeRangeInput = document.getElementById("queryModeInput");
const queryModeHipster = document.getElementById("inputHipster");
const queryModeMix = document.getElementById("inputMix");
const queryModeMainstream = document.getElementById("inputMainstream");

const rangeSliderManagement = () => {
	if (queryModeRangeInput.value < 4000) {
		queryModeHipster.classList.add("opacity-1");
		queryModeHipster.classList.remove("opacity-0");
		queryModeMix.classList.add("opacity-0");
		queryModeMainstream.classList.add("opacity-0");
	} else if (queryModeRangeInput.value > 3000 && queryModeRangeInput.value < 7000) {
		queryModeHipster.classList.add("opacity-0");
		queryModeMix.classList.add("opacity-1");
		queryModeMix.classList.remove("opacity-0");
		queryModeMainstream.classList.add("opacity-0");
	} else {
		queryModeHipster.classList.add("opacity-0");
		queryModeMix.classList.add("opacity-0");
		queryModeMainstream.classList.add("opacity-1");
		queryModeMainstream.classList.remove("opacity-0");
	}
};
