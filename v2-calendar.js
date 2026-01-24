!(function () {
  var today = moment();

  function slotLabel(hour, price) {
    var ret = (hour == 22) ? "22:00 - 07:00" : `${hour}:00`;
    if (price) ret += ` (${price}€)`;
    return ret;
  }

  function Calendar(selector, slotCallback) {
    this.el = document.querySelector(selector);
    this.api = "https://booking.polnasauna.sk";
    this.current = moment().date(1);
    this.slotCallback = slotCallback;
    this.draw();
  }

  Calendar.prototype.fetchAvailableSlots = function () {
    let year = this.current.year();
    let month = this.current.month() + 1;
    let url = `${this.api}/v2-bookings/${year}/${month}`;

    return fetch(url)
      .then((res) => res.json())
      .catch((error) => {
        console.error("Chyba:", error);
      });
  };

  Calendar.prototype.submitBooking = function (booking) {
    return fetch(`${this.api}/v2-booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
  };

  Calendar.prototype.draw = function () {
    this.drawing = true
    this.drawHeader();
    this.fetchAvailableSlots().then((slots) => {
      this.drawMonth(slots);
    });
  };

  Calendar.prototype.drawHeader = function () {
    var self = this;
    if (!this.header) {
      // Create the header elements
      this.header = createElement("div", "header");
      this.header.className = "header";

      this.title = createElement("h1");

      var right = createElement("div", "right");
      right.addEventListener("click", () => self.nextMonth());

      var left = createElement("div", "left");
      left.addEventListener("click", () => self.prevMonth());

      //Append the Elements
      this.header.appendChild(this.title);
      this.header.appendChild(right);
      this.header.appendChild(left);
      this.el.appendChild(this.header);
    }

    this.title.innerHTML = this.current.format("MMMM YYYY");
  };

  Calendar.prototype.drawMonth = function (slots) {
    var self = this;

    if (this.month) {
      this.oldMonth = this.month;
      this.oldMonth.className = "month out " + (self.next ? "next" : "prev");
      this.oldMonth.addEventListener("webkitAnimationEnd", function () {
        self.oldMonth.parentNode.removeChild(self.oldMonth);
        self.month = createElement("div", "month");
        self.backFill();
        self.currentMonth(slots);
        self.forwardFill();
        self.el.appendChild(self.month);
        window.setTimeout(function () {
          self.month.className = "month in " + (self.next ? "next" : "prev");
        }, 16);

        if (self.legend)
          self.legend.parentNode.removeChild(self.legend);
        self.legend = self.drawLegend(slots);
        self.el.appendChild(self.legend);
        self.drawing = false
      });
    } else {
      this.month = createElement("div", "month");
      this.el.appendChild(this.month);
      this.backFill();
      this.currentMonth(slots);
      this.forwardFill();
      this.month.className = "month new";
      this.legend = this.drawLegend(slots);
      this.el.appendChild(this.legend);
      this.drawing = false
    }
  };

  Calendar.prototype.backFill = function () {
    var clone = this.current.clone();
    var dayOfWeek = clone.weekday();

    if (!dayOfWeek) {
      return;
    }

    clone.subtract(dayOfWeek + 1, "days");

    for (var i = dayOfWeek; i > 0; i--) {
      this.drawDay(clone.add(1, "days"), []);
    }
  };

  Calendar.prototype.forwardFill = function () {
    var clone = this.current.clone().add(1, "months").subtract(1, "days");
    var dayOfWeek = clone.weekday();

    if (dayOfWeek === 6) {
      return;
    }

    for (var i = dayOfWeek; i < 6; i++) {
      this.drawDay(clone.add(1, "days"), []);
    }
  };

  Calendar.prototype.currentMonth = function (slots) {
    var clone = this.current.clone();

    // console.log(slots);
    while (clone.month() === this.current.month()) {
      day = clone.date();
      this.drawDay(clone, slots[day - 1]);
      clone.add(1, "days");
    }
  };

  Calendar.prototype.getWeek = function (day) {
    if (!this.week || day.weekday() === 0) {
      this.week = createElement("div", "week");
      this.month.appendChild(this.week);
    }
  };

  Calendar.prototype.drawDay = function (day, daySlots) {
    var self = this;
    this.getWeek(day);

    var outer = createElement("div", this.getDayClass(day));

    if (day.month() === this.current.month()) {
      if (day.isSameOrAfter(today, "day") && daySlots.length > 0) {
        outer.addEventListener("click", function () {
          self.toggleDay(this, daySlots);
        });
      }
    } else {
      if (day.isAfter(this.current)) {
          outer.addEventListener("click", function() { self.nextMonth() });
      } else if (day.isBefore(this.current)) {
          outer.addEventListener("click", function() { self.prevMonth() });
      }
    }

    var name = createElement("div", "day-name", day.format("ddd"));
    var number = createElement("div", "day-number", day.format("DD"));
    var slots_div = createElement("div", "day-slots");

    this.drawSlots(day, daySlots, slots_div);

    outer.appendChild(name);
    outer.appendChild(number);

    outer.appendChild(slots_div);
    this.week.appendChild(outer);
  };

  Calendar.prototype.drawSlots = function (day, daySlots, element) {
    // do not draw if month differs
    if (day.month() !== this.current.month()) return;

    // do not draw slots in the past
    if (day.isBefore(today, "day")) return;

    // console.log(daySlots);
    daySlots.forEach(function ([hour, price]) {
      var slotSpan = createElement("span", "slot" + hour);
      element.appendChild(slotSpan);
    });
  };

  Calendar.prototype.getDayClass = function (day) {
    classes = ["day"];
    if (day.month() !== this.current.month()) {
      classes.push("other");
    }
    // RAS: added
    else if (today.isAfter(day, "day")) {
      classes.push("other");
    } else if (today.isSame(day, "day")) {
      classes.push("today");
    }
    return classes.join(" ");
  };

  Calendar.prototype.toggleDay = function (el, daySlots) {
    var details, arrow;
    var dayNumber =
      +el.querySelectorAll(".day-number")[0].innerText ||
      +el.querySelectorAll(".day-number")[0].textContent;
    var day = this.current.clone().date(dayNumber);

    var currentOpened = document.querySelector(".details");
    var legend = document.querySelector(".legend");
    var arrow = document.querySelector(".arrow");

    // check to see if there is an open details box on the current row (week)
    if (currentOpened && currentOpened.parentNode === el.parentNode) {
      details = currentOpened;

      // close details if clicked on the same day
      if (details.dataset.dayNumber == dayNumber) {
        const _events = ["webkitAnimationEnd", "oanimationend", "msAnimationEnd", "animationend"];
        _events.forEach(function(ev) {
          currentOpened.addEventListener(ev, function () {
            currentOpened.parentNode.removeChild(currentOpened);
            legend.style.opacity = 1;
          });
        });
        currentOpened.className = "details out";
      }
    } else {
      // Close the open events on differnt week row
      // currentOpened && currentOpened.parentNode.removeChild(currentOpened);
      if (currentOpened) {
        const _events = ["webkitAnimationEnd", "oanimationend", "msAnimationEnd", "animationend"];
        _events.forEach(function(ev) {
          currentOpened.addEventListener(ev, function () {
            currentOpened.parentNode.removeChild(currentOpened);
          });
        });
        currentOpened.className = "details out";
      }

      var details = createElement("div", "details in");
      var arrow = createElement("div", "arrow");

      details.appendChild(arrow);
      el.parentNode.appendChild(details);
      legend.style.opacity = 0;
    }

    details.dataset.dayNumber = dayNumber;
    // RAS
    if (daySlots.length > 0) this.renderSlots(daySlots, day, details);

    arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + el.offsetWidth/2 + "px";
  };

  Calendar.prototype.renderSlots = function (daySlots, date, ele) {
    var self = this;
    //Remove any events in the current details element
    var currentWrapper = ele.querySelector(".events");
    var wrapper = createElement(
      "div",
      "events in" + (currentWrapper ? " new" : "")
    );

    daySlots.forEach(function ([hour,price]) {
      var div = createElement("div", "event");
      div.addEventListener("click", function () {
        self.slotCallback(date.year(), date.month() + 1, date.date(), hour, price);
      });
      var square = createElement("div", "event-category " + "slot" + hour);
      // var span = createElement("span", "", slotLabel(hour, price));
      var span = createElement("span", "", `${hour}:00 (${price}€)`);

      div.appendChild(square);
      div.appendChild(span);
      wrapper.appendChild(div);
    });

    if (currentWrapper) {
      currentWrapper.className = "events out";
      const _events = ["webkitAnimationEnd", "oanimationend", "msAnimationEnd", "animationend"];
      _events.forEach(function(ev) {
        currentWrapper.addEventListener(ev, function () {
          currentWrapper.parentNode.removeChild(currentWrapper);
          ele.appendChild(wrapper);
        });
      });
    } else {
      ele.appendChild(wrapper);
    }
  };

  Calendar.prototype.drawLegend = function (slots) {
    var legend = createElement("div", "legend");

    const timeSlots = [...new Map(slots
        .flatMap(inner => inner)
        .map(item => [item[0], item])
    ).values()].sort((a, b) => a[0] - b[0]);

    timeSlots.forEach(function ([hour, price]) {
      var div = createElement("div", "event-slot");
      var text = createElement("div", "event-category " + "slot" + hour);
      var span = createElement("span", "", slotLabel(hour, price));
      div.appendChild(text);
      div.appendChild(span);
      legend.appendChild(div);
    });
    return legend;
  };

  Calendar.prototype.nextMonth = function () {
    if (this.drawing)
          return;
    // going too much into the future is not allowed
    var nextYear = today.clone();
    nextYear.add(11, "months");
    if (this.current.isAfter(nextYear, "month")) return;

    this.current.add(1, "months");
    this.next = true;
    this.draw();
  };

  Calendar.prototype.prevMonth = function () {
    if (this.drawing)
          return;
    // going into the past is not allowed
    if (today.isAfter(this.current, "day")) return;

    this.current.subtract(1, "months");
    this.next = false;
    this.draw();
  };

  window.Calendar = Calendar;

  function createElement(tagName, className, innerText) {
    var ele = document.createElement(tagName);
    if (className) {
      ele.className = className;
    }
    if (innerText) {
      ele.innderText = ele.textContent = innerText;
    }
    return ele;
  }
})();

!(function () {
  onSlotSelect = function (year, month, day, hour, price) {
    obj = document.forms["reservation"];
    obj.elements["year"].value = year;
    obj.elements["month"].value = month;
    obj.elements["day"].value = day;
    obj.elements["hour"].value = hour;

    var _hour = (hour == 22) ? "22:00 - 07:00" : `${hour}:00 - ${hour+3}:00`;
    document.getElementById("term").innerHTML = `${day}.${month}.${year} ${_hour}`;
    document.getElementById("price").innerHTML = `${price} €`;

    var reservation = document.getElementById("reservation");
    reservation.scrollIntoView();
  };

  var calendar = new Calendar("#calendar", onSlotSelect);

  const form = document.getElementById("reservation");

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const {
      name,
      email,
      address,
      birthdate,
      phone,
      year,
      month,
      day,
      hour,
      discount_code,
    } = form.elements;

    const errorsDiv = document.getElementById('form_errors');
    const errors = [];
    if (!hour.value) errors.push("Prosím zvoľte si svoj termín v kalendári");
    if (!name.value.trim()) errors.push('Meno je povinné');
    if (!email.value.trim()) errors.push('Email je povinný');
    if (!address.value.trim()) errors.push('Adresa je povinná');
    if (!birthdate.value) errors.push('Dátum narodenia je povinný');
    if (!phone.value.trim()) errors.push('Tel. číslo je povinné');

    if (errors.length > 0) {
      errorsDiv.innerHTML = '';
      const ul = document.createElement('ul');
      errors.forEach(err => {
        const li = document.createElement('li');
        li.textContent = err;
        ul.appendChild(li);
      });
      errorsDiv.appendChild(ul);
      errorsDiv.style.display = 'block';
      return;
    } else {
      errorsDiv.innerHTML = '';
      errorsDiv.style.display = 'none';
    }

    const booking = {
      name: name.value,
      email: email.value,
      address: address.value,
      birthdate: birthdate.value,
      phone: phone.value,
      date: `${year.value}-${month.value.padStart(2, "0")}-${day.value.padStart(2, "0")}`,
      hour: hour.value,
      // discount: discount,
    };
    try {
      const res = await calendar.submitBooking(booking);
      const data = await res.json();

      if (res.status === 201) {
        // window.location.href = "success";
        _gopay.checkout({gatewayUrl: data.gw_url, inline: true});
      } else if (res.status === 409 || res.status === 422) {
        throw new Error(data.detail?.[0]?.msg || data.detail);
      } else {
        throw new Error("Nastala chyba");
      }
    } catch (err) {
      throw new Error(err.message || err);
    }
  });
})();

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservation');
  const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
  hiddenInputs.forEach(input => input.value = '');
});
