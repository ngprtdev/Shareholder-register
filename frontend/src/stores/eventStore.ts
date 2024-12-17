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
      console.log("eventsData", eventsData);

      eventsData.forEach((event) => {
        events.push(event);
        console.log("events after every push", events);

        updateShareholders(event);
      });

      isLoaded.value = true;
    } catch (error) {
      console.error("Erreur lors de la récupération des événements :", error);
      throw error;
    }
  };

  const addEvent = async (newEvent: NewEvent) => {
    console.log("newEvent in addEvent", newEvent);
    if (
      (newEvent.type === "EXERCISE" || newEvent.type === "TRANSFER") &&
      isLoaded
    ) {
      const shareholder =
        newEvent.type === "TRANSFER"
          ? shareholders.find((s) => s.contact === newEvent.seller)
          : shareholders.find((s) => s.contact === newEvent.contact);

      if (!shareholder) {
        console.error(
          `Aucun actionnaire trouvé correspondant à l'événement :`,
          newEvent
        );
        return;
      }
      console.log("shareholder", shareholder);
      if (shareholder[newEvent.stock] < newEvent.quantity) {
        console.error(
          `L'actionnaire ${shareholder.contact} n'a pas assez de ${
            newEvent.stock
          }. 
           Quantité demandée : ${newEvent.quantity}, Quantité détenue : ${
            shareholder[newEvent.stock]
          }`
        );
        return;
      }
    }

    if (newEvent.date) {
      newEvent.date = new Date(newEvent.date).toISOString();
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/events",
        newEvent
      );
      const createdEvent = response.data;

      events.push(createdEvent);

      updateShareholders(createdEvent);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'événement :", error);
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
    if (index !== -1) {
      const oldEvent = events[index];

      console.log("updatedEvent", updatedEvent);

      if (oldEvent.type === "TRANSFER") {
        const fromShareholder = shareholders.find(
          (s) => s.contact === oldEvent.data.seller
        );
        const oldToShareholder = shareholders.find(
          (s) => s.contact === oldEvent.data.transferee
        );

        if (fromShareholder && oldToShareholder) {
          if (oldEvent.stock === "Actions") {
            fromShareholder.Actions += oldEvent.quantity;
            oldToShareholder.Actions -= oldEvent.quantity;
          } else if (oldEvent.stock === "BSA") {
            fromShareholder.BSA += oldEvent.quantity;
            oldToShareholder.BSA -= oldEvent.quantity;
          } else if (oldEvent.stock === "BSPCE") {
            fromShareholder.BSPCE += oldEvent.quantity;
            oldToShareholder.BSPCE -= oldEvent.quantity;
          } else if (oldEvent.stock === "AGA") {
            fromShareholder.AGA += oldEvent.quantity;
            oldToShareholder.AGA -= oldEvent.quantity;
          }
        }
      } else {
        updateShareholdersOnDelete(oldEvent);
      }

      events[index] = { ...oldEvent, ...updatedEvent };

      console.log("updatedEvent", updatedEvent);

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
      try {
        await axios.put(
          `http://localhost:3000/events/${updatedEvent.id}`,
          formData
        );

        console.log("Événement mis à jour avec succès sur le serveur");
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour de l'événement sur le serveur :",
          error
        );
      }

      if (updatedEvent.type === "TRANSFER") {
        const fromShareholder = shareholders.find(
          (s) => s.contact === updatedEvent.data.seller
        );
        const newToShareholder = shareholders.find(
          (s) => s.contact === updatedEvent.data.transferee
        );

        if (fromShareholder) {
          if (updatedEvent.stock === "Actions") {
            fromShareholder.Actions -= updatedEvent.quantity;
          } else if (updatedEvent.stock === "BSA") {
            fromShareholder.BSA -= updatedEvent.quantity;
          } else if (updatedEvent.stock === "BSPCE") {
            fromShareholder.BSPCE -= updatedEvent.quantity;
          } else if (updatedEvent.stock === "AGA") {
            fromShareholder.AGA -= updatedEvent.quantity;
          }
        }

        if (oldEvent.data.transferee !== updatedEvent.data.transferee) {
          const oldToShareholder = shareholders.find(
            (s) => s.contact === oldEvent.data.transferee
          );

          if (oldToShareholder) {
            if (oldEvent.stock === "Actions") {
              oldToShareholder.Actions -= oldEvent.quantity;
            } else if (oldEvent.stock === "BSA") {
              oldToShareholder.BSA -= oldEvent.quantity;
            } else if (oldEvent.stock === "BSPCE") {
              oldToShareholder.BSPCE -= oldEvent.quantity;
            } else if (oldEvent.stock === "AGA") {
              oldToShareholder.AGA -= oldEvent.quantity;
            }
          }
        }

        if (!newToShareholder) {
          shareholders.push({
            id: Date.now().toString(),
            contact: updatedEvent.data.transferee
              ? updatedEvent.data.transferee
              : "",
            Actions:
              updatedEvent.stock === "Actions" ? updatedEvent.quantity : 0,
            BSA: updatedEvent.stock === "BSA" ? updatedEvent.quantity : 0,
            BSPCE: updatedEvent.stock === "BSPCE" ? updatedEvent.quantity : 0,
            AGA: updatedEvent.stock === "AGA" ? updatedEvent.quantity : 0,
          });
        } else {
          if (updatedEvent.stock === "Actions") {
            newToShareholder.Actions += updatedEvent.quantity;
          } else if (updatedEvent.stock === "BSA") {
            newToShareholder.BSA += updatedEvent.quantity;
          } else if (updatedEvent.stock === "BSPCE") {
            newToShareholder.BSPCE += updatedEvent.quantity;
          } else if (updatedEvent.stock === "AGA") {
            newToShareholder.AGA += updatedEvent.quantity;
          }
        }
      } else if (updatedEvent.type === "EXERCISE") {
        const shareholder = shareholders.find(
          (s) => s.contact === updatedEvent.data.contact
        );

        if (shareholder) {
          const stockType = updatedEvent.stock;

          if (shareholder[stockType] < updatedEvent.quantity) {
            console.error(
              `L'actionnaire ${updatedEvent.data.contact} n'a pas assez de ${stockType} pour exercer.`
            );
            return;
          }

          shareholder[stockType] -= updatedEvent.quantity;

          shareholder.Actions += updatedEvent.quantity;

          events[index] = { ...oldEvent, ...updatedEvent };
        } else {
          console.error(`Actionnaire ${updatedEvent.data.contact} non trouvé.`);
        }
      } else {
        updateShareholders(updatedEvent);
      }
    } else {
      console.error(
        `Impossible de trouver l'événement avec l'ID ${updatedEvent.id}`
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
  };

  const updateShareholders = (newEvent: Event) => {
    console.log("newEvent in updateShareholders", newEvent);
    if (newEvent.type === "TRANSFER") {
      const fromShareholder = shareholders.find(
        (s) => s.contact === newEvent.data.seller
      );
      const toShareholder = shareholders.find(
        (s) => s.contact === newEvent.data.transferee
      );

      if (!fromShareholder) {
        console.error(
          `Actionnaire vendeur introuvable : ${newEvent.data.seller}`
        );
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
            console.error(`Type d'action non reconnu : ${newEvent.stock}`);
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
          console.error(`Type d'action non reconnu : ${newEvent.stock}`);
          return;
      }
    } else if (newEvent.type === "EXERCISE") {
      const shareholder = shareholders.find(
        (s) => s.contact === newEvent.data.contact
      );

      if (shareholder) {
        const stockType = newEvent.stock;

        if (shareholder[stockType] < newEvent.quantity) {
          console.error(
            `L'actionnaire ${newEvent.data.contact} n'a pas assez de ${stockType} pour exercer.`
          );
          return;
        }

        shareholder[stockType] -= newEvent.quantity;

        shareholder.Actions += newEvent.quantity;
      } else {
        console.error(`Actionnaire ${newEvent.data.contact} non trouvé.`);
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
            console.error(`Type d'action non reconnu : ${newEvent.stock}`);
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
