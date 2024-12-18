import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";
import { Event } from "../types/event.types";
import axios from "axios";

interface NewEvent {
  type: "EXERCISE" | "TRANSFER" | "ISSUANCE";
  stock: "Actions" | "BSA" | "BSPCE" | "AGA";
  quantity: number;
  contact?: string;
  seller?: string;
  transferee?: string;
  date: string;
}
export interface Shareholder {
  id: string;
  contact: string;
  Actions: number;
  BSA: number;
  BSPCE: number;
  AGA: number;
}

export const useEventStore = defineStore("eventStore", () => {
  const events = reactive<Event[]>([]);

  const shareholders = reactive<Shareholder[]>([]);

  const isLoaded = ref(false);

  const ShareholdersFollowup = reactive<{ [key: string]: Array<any> }>({});

  const getAllEvents = async () => {
    try {
      const response = await axios.get<Event[]>("http://localhost:3000/events");
      const eventsData = response.data;

      if (!Array.isArray(eventsData)) {
        throw new Error("Le backend n'a pas renvoyé un tableau.");
      }

      eventsData.sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;

        const typeOrder = ["ISSUANCE", "TRANSFER", "EXERCISE"];
        const firstIndex = typeOrder.indexOf(a.type);
        const secondIndex = typeOrder.indexOf(b.type);

        return firstIndex - secondIndex;
      });

      eventsData.forEach((event) => {
        events.push(event);

        const contact =
          event.type === "TRANSFER"
            ? [event.data.seller, event.data.transferee]
            : [event.data.contact];
        const stockType = event.stock;

        contact.forEach((c) => {
          if (!c) return;

          if (!ShareholdersFollowup[c]) {
            ShareholdersFollowup[c] = [];
          }

          const newEntry = {
            date: event.date,
            Actions: stockType === "Actions" ? event.quantity : 0,
            BSA: stockType === "BSA" ? event.quantity : 0,
            BSPCE: stockType === "BSPCE" ? event.quantity : 0,
            AGA: stockType === "AGA" ? event.quantity : 0,
          };

          if (event.type === "TRANSFER") {
            if (c === event.data.seller) {
              newEntry.Actions = stockType === "Actions" ? -event.quantity : 0;
              newEntry.BSA = stockType === "BSA" ? -event.quantity : 0;
              newEntry.BSPCE = stockType === "BSPCE" ? -event.quantity : 0;
              newEntry.AGA = stockType === "AGA" ? -event.quantity : 0;
            }
          } else if (event.type === "EXERCISE") {
            const decrementEntry = { ...newEntry };
            decrementEntry[stockType] = -event.quantity;
            ShareholdersFollowup[c].push(decrementEntry);

            const incrementEntry = { ...newEntry };
            incrementEntry.Actions = event.quantity;
            incrementEntry[stockType] = 0;
            ShareholdersFollowup[c].push(incrementEntry);
            return;
          }

          ShareholdersFollowup[c].push(newEntry);

          ShareholdersFollowup[c].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        });

        updateShareholders(event);
      });

      isLoaded.value = true;
    } catch (error) {
      console.error("Erreur lors de la récupération des événements :", error);
      throw error;
    }
  };

  const addEvent = async (newEvent: NewEvent) => {
    if (newEvent.date) {
      newEvent.date = new Date(newEvent.date).toISOString();
    }

    if (newEvent.type === "TRANSFER" || newEvent.type === "EXERCISE") {
      const targetContact =
        newEvent.type === "TRANSFER" ? newEvent.seller : newEvent.contact;

      if (!targetContact || !ShareholdersFollowup[targetContact]) {
        alert(`Actionnaire introuvable : ${targetContact}`);
        return;
      }

      const shareholder = shareholders.find((s) => s.contact === targetContact);
      if (!shareholder) {
        alert(`Actionnaire introuvable : ${targetContact}`);
        return;
      }

      if (shareholder[newEvent.stock] < newEvent.quantity) {
        alert(
          `Stock insuffisant pour l'actionnaire ${targetContact} à la date demandée :
           Stock actuel : ${shareholder[newEvent.stock]}, 
           Quantité demandée : ${newEvent.quantity}`
        );
        return;
      }

      const relevantEntries = ShareholdersFollowup[targetContact].filter(
        (entry) => new Date(entry.date) <= new Date(newEvent.date)
      );

      const cumulativeStock = relevantEntries.reduce(
        (total, entry) => total + (entry[newEvent.stock] || 0),
        0
      );

      if (cumulativeStock < newEvent.quantity) {
        alert(
          `Stock insuffisant pour ${targetContact} dans ShareholdersFollowup : 
           Stock disponible : ${cumulativeStock}, 
           Quantité demandée : ${newEvent.quantity}`
        );
        return;
      }
    }

    const contact =
      newEvent.type === "TRANSFER"
        ? [newEvent.seller, newEvent.transferee]
        : [newEvent.contact];
    const stockType = newEvent.stock;

    contact.forEach((c) => {
      if (!c) return;

      if (!ShareholdersFollowup[c]) {
        ShareholdersFollowup[c] = [];
      }

      const newEntry = {
        date: newEvent.date,
        Actions: stockType === "Actions" ? newEvent.quantity : 0,
        BSA: stockType === "BSA" ? newEvent.quantity : 0,
        BSPCE: stockType === "BSPCE" ? newEvent.quantity : 0,
        AGA: stockType === "AGA" ? newEvent.quantity : 0,
      };

      if (newEvent.type === "TRANSFER") {
        if (c === newEvent.seller) {
          newEntry.Actions = stockType === "Actions" ? -newEvent.quantity : 0;
          newEntry.BSA = stockType === "BSA" ? -newEvent.quantity : 0;
          newEntry.BSPCE = stockType === "BSPCE" ? -newEvent.quantity : 0;
          newEntry.AGA = stockType === "AGA" ? -newEvent.quantity : 0;
        }
      } else if (newEvent.type === "EXERCISE") {
        const decrementEntry = { ...newEntry };
        decrementEntry[stockType] = -newEvent.quantity;

        const incrementEntry = { ...newEntry };
        incrementEntry.Actions = newEvent.quantity;
        incrementEntry[stockType] = 0;

        ShareholdersFollowup[c].push(decrementEntry);
        ShareholdersFollowup[c].push(incrementEntry);

        return;
      }

      ShareholdersFollowup[c].push(newEntry);

      ShareholdersFollowup[c].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/events",
        newEvent
      );
      const createdEvent = response.data;

      events.push(createdEvent);

      updateShareholders(createdEvent);
    } catch (error) {
      console.error("Error in addEvent axios.post:", error);
    }
  };

  const canDeleteEvent = (deletedEvent: Event) => {
    const shareholder = shareholders.find(
      (s) => s.contact === deletedEvent.data.contact
    );

    if (shareholder) {
      let remainingStock = 0;
      if (deletedEvent.stock === "Actions") {
        remainingStock = shareholder.Actions - deletedEvent.quantity;
      } else if (deletedEvent.stock === "BSA") {
        remainingStock = shareholder.BSA - deletedEvent.quantity;
      } else if (deletedEvent.stock === "BSPCE") {
        remainingStock = shareholder.BSPCE - deletedEvent.quantity;
      } else if (deletedEvent.stock === "AGA") {
        remainingStock = shareholder.AGA - deletedEvent.quantity;
      }

      if (remainingStock < 0) {
        return false;
      }
    }

    return true;
  };

  const updateEvent = async (updatedEvent: Event) => {
    const index = events.findIndex((event) => event.id === updatedEvent.id);
    if (index === -1) {
      alert(`Impossible de trouver l'événement.`);
      return;
    }

    const oldEvent = events[index];
    const stockType = updatedEvent.stock;

    if (updatedEvent.type === "ISSUANCE") {
      const targetContact = updatedEvent.data.contact;

      if (!targetContact) {
        alert(`Actionnaire introuvable : ${targetContact}`);
        return;
      }

      const shareholder = shareholders.find((s) => s.contact === targetContact);
      if (!shareholder) {
        alert(`Actionnaire introuvable dans shareholders : ${targetContact}`);
        return;
      }
      const difference = oldEvent.quantity - updatedEvent.quantity;

      if (difference > shareholder[stockType]) {
        alert(
          `Stock insuffisant pour modifier l'émission :
           Différence à gérer : ${difference},
           Stock disponible : ${shareholder[stockType]}`
        );
        return;
      }
    } else if (
      updatedEvent.type === "TRANSFER" ||
      updatedEvent.type === "EXERCISE"
    ) {
      const targetContact =
        updatedEvent.type === "TRANSFER"
          ? updatedEvent.data.seller
          : updatedEvent.data.contact;

      if (!targetContact) {
        alert(`Actionnaire introuvable : ${targetContact}`);
        return;
      }

      const shareholder = shareholders.find((s) => s.contact === targetContact);
      if (!shareholder) {
        alert(`Actionnaire introuvable dans shareholders : ${targetContact}`);
        return;
      }

      const availableStock = shareholder[stockType] + oldEvent.quantity;

      if (updatedEvent.quantity > availableStock) {
        alert(
          `Stock insuffisant pour modifier l'événement :
           Stock disponible (actionnaire + événement) : ${availableStock},
           Quantité demandée : ${updatedEvent.quantity}`
        );
        return;
      }
    }

    try {
      const formData = {
        id: updatedEvent.id,
        type: updatedEvent.type,
        date: updatedEvent.date,
        stock: updatedEvent.stock,
        quantity: updatedEvent.quantity,
        unitPrice: updatedEvent.unitPrice,
        contact: updatedEvent.data.contact,
        seller: updatedEvent.data.seller,
        transferee: updatedEvent.data.transferee,
      };

      const response = await axios.put(
        `http://localhost:3000/events/${updatedEvent.id}`,
        formData
      );

      const updatedEventData = response.data;

      updateShareholdersOnDelete(oldEvent);

      events[index] = updatedEventData;
      updateShareholders(updatedEventData);

      events.splice(0, events.length);
      for (const key in ShareholdersFollowup) {
        delete ShareholdersFollowup[key];
      }
      shareholders.splice(0, shareholders.length);
      isLoaded.value = false;
      await getAllEvents();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'événement sur le serveur :",
        error
      );
    }
  };

  const deleteEvent = async (eventId: string) => {
    const eventIndex = events.findIndex((event) => event.id === eventId);
    if (eventIndex !== -1) {
      const deletedEvent = events[eventIndex];

      if (!canDeleteEvent(deletedEvent)) {
        if (
          confirm(
            `Attention! Il semblerait que des cessions ou exercices soient attachés à cette émission. 
          Êtes-vous sûr de vouloir supprimer cet événement ?`
          )
        ) {
          try {
            await axios.delete(`http://localhost:3000/events/${eventId}`);

            events.splice(eventIndex, 1);

            updateShareholdersOnDelete(deletedEvent);
          } catch (error) {
            console.error(
              "Erreur lors de la suppression de l'événement :",
              error
            );
          }
        }
      } else {
        try {
          await axios.delete(`http://localhost:3000/events/${eventId}`);

          events.splice(eventIndex, 1);

          updateShareholdersOnDelete(deletedEvent);
        } catch (error) {
          console.error(
            "Erreur lors de la suppression de l'événement :",
            error
          );
        }
      }
    }

    events.splice(0, events.length);
    for (const key in ShareholdersFollowup) {
      delete ShareholdersFollowup[key];
    }
    shareholders.splice(0, shareholders.length);
    isLoaded.value = false;
    await getAllEvents();
  };

  const updateShareholders = (newEvent: Event) => {
    if (newEvent.type === "TRANSFER") {
      const fromShareholder = shareholders.find(
        (s) => s.contact === newEvent.data.seller
      );
      const toShareholder = shareholders.find(
        (s) => s.contact === newEvent.data.transferee
      );

      if (!fromShareholder) {
        alert(`Actionnaire vendeur introuvable : ${newEvent.data.seller}`);
        deleteEvent(newEvent.id);
        return;
      }

      if (!toShareholder) {
        shareholders.push({
          id: Date.now().toString(),
          contact: newEvent.data.transferee,
          Actions: newEvent.stock === "Actions" ? newEvent.quantity : 0,
          BSA: newEvent.stock === "BSA" ? newEvent.quantity : 0,
          BSPCE: newEvent.stock === "BSPCE" ? newEvent.quantity : 0,
          AGA: newEvent.stock === "AGA" ? newEvent.quantity : 0,
        });
      } else {
        switch (newEvent.stock) {
          case "Actions":
            toShareholder.Actions += newEvent.quantity;
            break;
          case "BSA":
            toShareholder.BSA += newEvent.quantity;
            break;
          case "BSPCE":
            toShareholder.BSPCE += newEvent.quantity;
            break;
          case "AGA":
            toShareholder.AGA += newEvent.quantity;
            break;
          default:
            alert(`Type d'action non reconnu : ${newEvent.stock}`);
            return;
        }
      }

      switch (newEvent.stock) {
        case "Actions":
          fromShareholder.Actions -= newEvent.quantity;
          break;
        case "BSA":
          fromShareholder.BSA -= newEvent.quantity;
          break;
        case "BSPCE":
          fromShareholder.BSPCE -= newEvent.quantity;
          break;
        case "AGA":
          fromShareholder.AGA -= newEvent.quantity;
          break;
        default:
          alert(`Type d'action non reconnu : ${newEvent.stock}`);
          return;
      }
    } else if (newEvent.type === "EXERCISE") {
      const shareholder = shareholders.find(
        (s) => s.contact === newEvent.data.contact
      );

      if (shareholder) {
        const stockType = newEvent.stock;

        if (shareholder[stockType] < newEvent.quantity) {
          alert(
            `L'actionnaire ${newEvent.data.contact} n'a pas assez de ${stockType} pour exercer.`
          );
          return;
        }

        shareholder[stockType] -= newEvent.quantity;

        shareholder.Actions += newEvent.quantity;
      } else {
        alert(`Actionnaire ${newEvent.data.contact} non trouvé.`);
      }
    } else {
      const shareholder = shareholders.find(
        (s) => s.contact === newEvent.data.contact
      );

      if (!shareholder) {
        shareholders.push({
          id: Date.now().toString(),
          contact: newEvent.data.contact || newEvent.data.transferee,
          Actions: newEvent.stock === "Actions" ? newEvent.quantity : 0,
          BSA: newEvent.stock === "BSA" ? newEvent.quantity : 0,
          BSPCE: newEvent.stock === "BSPCE" ? newEvent.quantity : 0,
          AGA: newEvent.stock === "AGA" ? newEvent.quantity : 0,
        });
      } else {
        switch (newEvent.stock) {
          case "Actions":
            shareholder.Actions += newEvent.quantity;
            break;
          case "BSA":
            shareholder.BSA += newEvent.quantity;
            break;
          case "BSPCE":
            shareholder.BSPCE += newEvent.quantity;
            break;
          case "AGA":
            shareholder.AGA += newEvent.quantity;
            break;
          default:
            alert(`Type d'action non reconnu : ${newEvent.stock}`);
        }
      }
    }
    shareholders.sort((a, b) => {
      if (a.contact < b.contact) return -1;
      if (a.contact > b.contact) return 1;
      return 0;
    });
  };

  const updateShareholdersOnDelete = (deletedEvent: Event) => {
    const shareholder = shareholders.find(
      (s) => s.contact === deletedEvent.data.contact
    );
    if (shareholder) {
      if (deletedEvent.type === "EXERCISE") {
        if (deletedEvent.stock === "BSA") {
          shareholder.BSA += deletedEvent.quantity;
          shareholder.Actions -= deletedEvent.quantity;
        } else if (deletedEvent.stock === "BSPCE") {
          shareholder.BSPCE += deletedEvent.quantity;
          shareholder.Actions -= deletedEvent.quantity;
        } else if (deletedEvent.stock === "AGA") {
          shareholder.AGA += deletedEvent.quantity;
          shareholder.Actions -= deletedEvent.quantity;
        }
      } else {
        if (deletedEvent.stock === "Actions") {
          shareholder.Actions -= deletedEvent.quantity;
        } else if (deletedEvent.stock === "BSA") {
          shareholder.BSA -= deletedEvent.quantity;
        } else if (deletedEvent.stock === "BSPCE") {
          shareholder.BSPCE -= deletedEvent.quantity;
        } else if (deletedEvent.stock === "AGA") {
          shareholder.AGA -= deletedEvent.quantity;
        }
      }
    }

    if (deletedEvent.type === "TRANSFER") {
      const fromShareholder = shareholders.find(
        (s) => s.contact === deletedEvent.data.seller
      );
      const toShareholder = shareholders.find(
        (s) => s.contact === deletedEvent.data.transferee
      );

      if (fromShareholder && toShareholder) {
        if (deletedEvent.stock === "Actions") {
          fromShareholder.Actions += deletedEvent.quantity;
          toShareholder.Actions -= deletedEvent.quantity;
        } else if (deletedEvent.stock === "BSA") {
          fromShareholder.BSA += deletedEvent.quantity;
          toShareholder.BSA -= deletedEvent.quantity;
        } else if (deletedEvent.stock === "BSPCE") {
          fromShareholder.BSPCE += deletedEvent.quantity;
          toShareholder.BSPCE -= deletedEvent.quantity;
        } else if (deletedEvent.stock === "AGA") {
          fromShareholder.AGA += deletedEvent.quantity;
          toShareholder.AGA -= deletedEvent.quantity;
        }
      }
    }
  };

  const totalShares = computed(() => {
    let total = 0;
    shareholders.forEach((shareholder) => {
      total += shareholder.Actions;
    });
    return total;
  });

  const totalFullyDilutedShares = computed(() => {
    let total = 0;
    shareholders.forEach((shareholder) => {
      total +=
        shareholder.Actions +
        shareholder.BSA +
        shareholder.BSPCE +
        shareholder.AGA;
    });
    return total;
  });

  const calculateFDPercentage = (shareholder: Shareholder) => {
    const total = totalFullyDilutedShares.value;
    const totalSharesOwner =
      shareholder.Actions +
      shareholder.BSA +
      shareholder.BSPCE +
      shareholder.AGA;
    return total ? (totalSharesOwner / total) * 100 : 0;
  };

  const calculateNFDPercentage = (shareholder: Shareholder) => {
    const total = totalShares.value;
    const totalSharesOwner = shareholder.Actions;
    return total ? (totalSharesOwner / total) * 100 : 0;
  };

  return {
    events,
    shareholders,
    isLoaded,
    getAllEvents,
    addEvent,
    deleteEvent,
    updateEvent,
    calculateFDPercentage,
    calculateNFDPercentage,
  };
});
