// src/utils/animateDatePicker.ts
import gsap from "gsap";
import {Draggable} from "gsap/all";
import {
  colors,
  getCurrentColorIndex,
  setCurrentColorIndex,
} from "@/utils/animationColors";
import {updateChosenColorsForElements} from "@/utils/animationMenuHandler";

gsap.registerPlugin(Draggable);

interface GenerateDatesParams {
  selectedYear?: number;
  selectedMonth?: number;
  selectedDay?: number;
  daysContainer: HTMLElement;
  monthsContainer: HTMLElement;
  yearContainer: HTMLElement;
}

function generateDates({
  selectedYear = new Date().getFullYear(),
  selectedMonth = new Date().getMonth(),
  selectedDay = new Date().getDate(),
  daysContainer,
  monthsContainer,
  yearContainer,
}: GenerateDatesParams): HTMLElement[] {
  if (!daysContainer || !monthsContainer || !yearContainer) return [];

  const currentYear = new Date().getFullYear();
  yearContainer.innerHTML = "";
  const year = document.createElement("div");
  year.classList.add("year");
  year.innerHTML = currentYear.toString();
  yearContainer.appendChild(year);

  updateChosenColorsForElements([year], "color", {
    blackWhite: false,
  });

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  daysContainer.innerHTML = "";
  const validDays: HTMLElement[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(selectedYear, selectedMonth, i);
    const dayOfWeek = date.getDay();

    // Exclure week-ends (dimanche = 0 et samedi = 6)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const day = document.createElement("div");
      day.classList.add("day");
      day.textContent = i.toString().padStart(2, "0");

      if (i === selectedDay) {
        day.classList.add("active");
      }

      validDays.push(day);
      daysContainer.appendChild(day);
    }
  }

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  monthsContainer.innerHTML = "";
  months.forEach((m, index) => {
    const monthDiv = document.createElement("div");
    monthDiv.classList.add("month");
    monthDiv.textContent = m;

    if (index === selectedMonth) {
      monthDiv.classList.add("active");
    }

    monthsContainer.appendChild(monthDiv);
  });

  return validDays;
}

function updateActive(
  container: Element,
  index: number,
  type: "day" | "month",
  selectedDate: {day?: string; month?: string}
) {
  const currentColorIndex: number = getCurrentColorIndex();
  const items = container.querySelectorAll(`.${type}`);
  const parent = container.parentElement;
  if (!parent || items.length === 0) return;

  const itemStyle = getComputedStyle(items[0]);
  const itemHeight =
    (items[0] as HTMLElement).offsetHeight +
    parseFloat(itemStyle.marginTop) +
    parseFloat(itemStyle.marginBottom);
  const containerHeight = parent.offsetHeight;
  const offsetToCenter = (containerHeight - itemHeight) / 2;
  const targetY = -index * itemHeight + offsetToCenter;

  items.forEach((item, idx) => {
    if (idx === index) {
      gsap.to(item, {
        fontSize: 24,
        opacity: 1,
        color: colors[currentColorIndex],
        duration: 0.15,
      });
    } else {
      gsap.to(item, {
        fontSize: 12,
        color: "#29292C",
        opacity: 0.25,
        duration: 0.15,
      });
    }
  });

  gsap.to(container, {
    y: targetY,
    duration: 0.15,
  });

  if (items[index].textContent) {
    if (type === "day") {
      selectedDate.day = items[index].textContent;
    } else {
      selectedDate.month = items[index].textContent;
    }
  }
}

function setupRoller(
  container: Element,
  type: "day" | "month",
  defaultIndex: number,
  selectedDate: {day?: string; month?: string},
  initCallback: (selectedDate: {day?: string; month?: string}) => void
) {
  const items = container.querySelectorAll(`.${type}`);
  if (items.length === 0) return;

  let activeIndex = Math.max(0, defaultIndex);
  let lastActiveIndex: number | null = null;
  let onMove = false;

  Draggable.create(container, {
    type: "y",
    bounds: {minY: -25 * (items.length - 1), maxY: 0},
    inertia: true,
    onDragStart: function () {
      lastActiveIndex = activeIndex;
    },
    onMove: function () {
      onMove = true;
    },
    onDragEnd: function () {
      const closestIndex = Math.round(
        (this.y - (container.parentElement!.offsetHeight - 50) / 2) / -50
      );
      onMove = false;
      const clampedIndex = Math.max(
        0,
        Math.min(closestIndex, items.length - 1)
      );

      setTimeout(() => {
        if (lastActiveIndex !== clampedIndex && !onMove) {
          lastActiveIndex = clampedIndex;
          updateActive(container, clampedIndex, type, selectedDate);
          initCallback(selectedDate);
        }
      }, 500);
    },
  });

  items.forEach((item, idx) => {
    item.addEventListener("click", () => {
      activeIndex = idx;
      updateActive(container, idx, type, selectedDate);
      initCallback(selectedDate);
    });
  });

  let scrollTimeout: number | null = null;
  container.parentElement!.addEventListener("wheel", (e: WheelEvent) => {
    e.preventDefault();

    if (e.deltaY > 0) {
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
    } else {
      activeIndex = Math.max(activeIndex - 1, 0);
    }

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = window.setTimeout(() => {
      updateActive(container, activeIndex, type, selectedDate);
      initCallback(selectedDate);
      scrollTimeout = null;
    }, 500);
  });

  updateActive(container, activeIndex, type, selectedDate);
}

export function animateDatePicker(
  containers: {
    daysContainer: HTMLElement;
    monthsContainer: HTMLElement;
    yearsContainer: HTMLElement;
  },
  onDateChange: (selectedDate: {day?: string; month?: string}) => void
) {
  const {daysContainer, monthsContainer, yearsContainer} = containers;

  const today = new Date();
  let selectedDay = today.getDate();
  let selectedMonth = today.getMonth();

  // Ajustement si aujourd'hui est un week-end
  if (today.getDay() === 0) {
    selectedDay += 1; // Dimanche → lundi suivant
  } else if (today.getDay() === 6) {
    selectedDay -= 1; // Samedi → vendredi précédent
  }

  const monthsArray = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  // Format de la date sélectionnée sans l'année
  const selectedDate: {day?: string; month?: string} = {
    day: selectedDay.toString().padStart(2, "0"),
    month: monthsArray[selectedMonth],
  };

  // Générer les éléments du DOM pour les jours et les mois
  const validDays = generateDates({
    selectedYear: today.getFullYear(),
    selectedMonth,
    selectedDay,
    daysContainer,
    monthsContainer,
    yearContainer: yearsContainer,
  });

  // Trouver l'index du jour courant parmi les jours valides
  const currentDayIndex = validDays.findIndex(
    (d) => parseInt(d.textContent || "0") === selectedDay
  );

  const currentMonthIndex = selectedMonth;

  // Définition du callback interne utilisé par setupRoller
  const initCallback = (updatedDate: {day?: string; month?: string}) => {
    // On passe la valeur mise à jour au callback fourni
    onDateChange({...updatedDate});
  };

  if (currentDayIndex !== -1 && daysContainer) {
    setupRoller(
      daysContainer,
      "day",
      currentDayIndex,
      selectedDate,
      initCallback
    );
  }

  if (monthsContainer) {
    setupRoller(
      monthsContainer,
      "month",
      currentMonthIndex,
      selectedDate,
      initCallback
    );
  }

  initCallback(selectedDate);
}
