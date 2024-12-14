import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import { Event } from "../types/event.types";

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

  const addEvent = (newEvent: Event) => {
    if (
      newEvent.type === "EXERCICE" &&
      (newEvent.stock === "BSA" ||
        newEvent.stock === "BSPCE" ||
        newEvent.stock === "AGA")
    ) {
      const shareholder = shareholders.find(
        (s) => s.contact === newEvent.contact
      );

      if (shareholder) {
        if (shareholder[newEvent.stock] < newEvent.quantity) {
          console.error(
            `L'actionnaire ${newEvent.contact} n'a pas assez de ${newEvent.stock} pour exercer.`
          );
          return;
        }

        shareholder[newEvent.stock] -= newEvent.quantity;

        shareholder.Actions += newEvent.quantity;
      } else {
        console.error(`Actionnaire ${newEvent.contact} non trouvé.`);
        return;
      }
    }

    events.push(newEvent);

    updateShareholders(newEvent);
  };

  const canDeleteEvent = (deletedEvent: Event) => {
    const shareholder = shareholders.find(
      (s) => s.contact === deletedEvent.contact
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

  const updateEvent = (updatedEvent: Event) => {
    const index = events.findIndex((event) => event.id === updatedEvent.id);
    if (index !== -1) {
      const oldEvent = events[index];

      if (oldEvent.type === "CESSION") {
        const fromShareholder = shareholders.find(
          (s) => s.contact === oldEvent.seller
        );
        const oldToShareholder = shareholders.find(
          (s) => s.contact === oldEvent.transferee
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

      if (updatedEvent.type === "CESSION") {
        const fromShareholder = shareholders.find(
          (s) => s.contact === updatedEvent.seller
        );
        const newToShareholder = shareholders.find(
          (s) => s.contact === updatedEvent.transferee
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

        if (oldEvent.transferee !== updatedEvent.transferee) {
          const oldToShareholder = shareholders.find(
            (s) => s.contact === oldEvent.transferee
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
            contact: updatedEvent.transferee ? updatedEvent.transferee : "",
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
      } else if (updatedEvent.type === "EXERCICE") {
        const shareholder = shareholders.find(
          (s) => s.contact === updatedEvent.contact
        );

        if (shareholder) {
          const stockType = updatedEvent.stock;

          if (shareholder[stockType] < updatedEvent.quantity) {
            console.error(
              `L'actionnaire ${updatedEvent.contact} n'a pas assez de ${stockType} pour exercer.`
            );
            return;
          }

          shareholder[stockType] -= updatedEvent.quantity;

          shareholder.Actions += updatedEvent.quantity;

          events[index] = { ...oldEvent, ...updatedEvent };
        } else {
          console.error(`Actionnaire ${updatedEvent.contact} non trouvé.`);
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

  const deleteEvent = (eventId: number) => {
    const eventIndex = events.findIndex(
      (event) => event.id === eventId.toString()
    );
    if (eventIndex !== -1) {
      const deletedEvent = events[eventIndex];

      if (!canDeleteEvent(deletedEvent)) {
        if (
          confirm(
            `La suppression de cet événement pourrait rendre le stock de titres concerné négatif. 
          Êtes-vous sûr de vouloir supprimer cet événement ?`
          )
        ) {
          events.splice(eventIndex, 1);
          updateShareholdersOnDelete(deletedEvent);
        }
      } else {
        events.splice(eventIndex, 1);
        updateShareholdersOnDelete(deletedEvent);
      }
    }
  };

  const transferShares = (
    fromContact: string,
    toContact: string,
    stockType: "Actions" | "BSA" | "BSPCE" | "AGA",
    quantity: number,
    eventData: Event
  ) => {
    if (!fromContact || !toContact || quantity <= 0) {
      console.error("Données de transfert invalides");
      return;
    }

    const fromShareholder = shareholders.find((s) => s.contact === fromContact);
    const toShareholder = shareholders.find((s) => s.contact === toContact);

    if (!fromShareholder) {
      console.error("Actionnaire vendeur introuvable :", fromContact);
      return;
    }

    if (fromShareholder[stockType] < quantity) {
      console.error(
        "Quantité insuffisante pour le transfert :",
        fromContact,
        stockType,
        quantity
      );
      return;
    }

    fromShareholder[stockType] -= quantity;

    if (!toShareholder) {
      shareholders.push({
        id: Date.now().toString(),
        contact: toContact,
        Actions: stockType === "Actions" ? quantity : 0,
        BSA: stockType === "BSA" ? quantity : 0,
        BSPCE: stockType === "BSPCE" ? quantity : 0,
        AGA: stockType === "AGA" ? quantity : 0,
      });
    } else {
      toShareholder[stockType] += quantity;
    }
    addEvent(eventData);
    console.log("shareholders after transfer", shareholders);
  };

  const updateShareholders = (newEvent: Event) => {
    if (!newEvent.contact) {
      return;
    }

    const shareholder = shareholders.find(
      (s) => s.contact === newEvent.contact
    );

    if (!shareholder) {
      shareholders.push({
        id: Date.now().toString(),
        contact: newEvent.contact,
        Actions: newEvent.stock === "Actions" ? newEvent.quantity : 0,
        BSA: newEvent.stock === "BSA" ? newEvent.quantity : 0,
        BSPCE: newEvent.stock === "BSPCE" ? newEvent.quantity : 0,
        AGA: newEvent.stock === "AGA" ? newEvent.quantity : 0,
      });
    } else {
      if (newEvent.type !== "EXERCICE") {
        if (newEvent.stock === "Actions") {
          shareholder.Actions += newEvent.quantity;
        } else if (newEvent.stock === "BSA") {
          shareholder.BSA += newEvent.quantity;
        } else if (newEvent.stock === "BSPCE") {
          shareholder.BSPCE += newEvent.quantity;
        } else if (newEvent.stock === "AGA") {
          shareholder.AGA += newEvent.quantity;
        }
      }
    }
  };

  const updateShareholdersOnDelete = (deletedEvent: Event) => {
    const shareholder = shareholders.find(
      (s) => s.contact === deletedEvent.contact
    );
    if (shareholder) {
      if (deletedEvent.type === "EXERCICE") {
        console.log("deletedEvent stock in store", deletedEvent.stock);
        if (deletedEvent.stock === "BSA") {
          console.log(
            "Réajout des BSA + valeur de quantity",
            deletedEvent.quantity
          );

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

    if (deletedEvent.type === "CESSION") {
      const fromShareholder = shareholders.find(
        (s) => s.contact === deletedEvent.seller
      );
      const toShareholder = shareholders.find(
        (s) => s.contact === deletedEvent.transferee
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
    addEvent,
    deleteEvent,
    updateEvent,
    transferShares,
    calculateFDPercentage,
    calculateNFDPercentage,
  };
});
