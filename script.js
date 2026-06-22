// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

// Max number of attendees
const maxCount = 50;

// Track attendance
let count = Number(localStorage.getItem("count")) || 0;

let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
    water: 0,
    zero: 0,
    power: 0
};

let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

// Load attendee count
attendeeCount.textContent = count;

document.getElementById("waterCount").textContent = teamCounts.water;
document.getElementById("zeroCount").textContent = teamCounts.zero;
document.getElementById("powerCount").textContent = teamCounts.power;

progressBar.style.width = (count / maxCount) * 100 + "%";

// Restore attendee list
attendees.forEach(addAttendeeToList);

// Helper function
function addAttendeeToList(attendee) {
    const list = document.getElementById(attendee.team + "List");

    if (!list) {
        console.error("List not found for team:", attendee.team);
        return;
    }

    const item = document.createElement("p");
    item.textContent = attendee.name;

    list.appendChild(item);
}

// Handle form submission
form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form values
    const name = nameInput.value;
    const team = teamSelect.value;
    const teamName = teamSelect.selectedOptions[0].text;

    // Increment count
    count++;
    teamCounts[team]++;
    console.log("Total check-ins: " + count);

    // Save to local storage
    attendees.push({
        name: name,
        team: team
    });
    localStorage.setItem("count", count);
    localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
    localStorage.setItem("attendees", JSON.stringify(attendees));

    // Update UI totals
    attendeeCount.textContent = count;
    document.getElementById(team + "Count").textContent = teamCounts[team];

    // Update progress bar
    const percentage = Math.round((count / maxCount) * 100) + "%";
    console.log(`Percentage: ${percentage}`);
    progressBar.style.width = percentage;

    addAttendeeToList({name, team: team});

    // Update greeting
    const message = `🎉 Welcome, ${name} from ${teamName} 🎉`
    console.log(message);
    greeting.textContent = message;
    greeting.style.display = "block";

    // Check if check-in goal is reached
    if (count >= maxCount) {
        const winnerKey = Object.keys(teamCounts).reduce((a, b) => 
            teamCounts[a] > teamCounts[b] ? a : b);
        const winnerName = 
        winnerKey === "water" ? "Team Water Wise"
        : winnerKey === "zero" ? "Team Net Zero" : "Team Renewables";
        
        greeting.textContent = `Congratulation, ${winnerName} for being the team with the most attendee`;
    }

    form.reset();
})
