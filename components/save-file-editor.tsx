import { Planets, SpawnableItems } from "@/lib/constants";

export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type IntArrayWithMeta = {
  __type: "System.Int32[],mscorlib";
  value: number[];
};

export type Vector3ArrayWithMeta = {
  __type: "UnityEngine.Vector3[],UnityEngine.CoreModule";
  value: Vector3[];
};

export type IntWithMeta = {
  __type: "int";
  value: number;
};

export type BoolWithMeta = {
  __type: "bool";
  value: boolean;
};

export type LCSaveType = {
  shipItemSaveData: IntArrayWithMeta;
  shipScrapValues: IntArrayWithMeta;
  shipGrabbableItemIDs: IntArrayWithMeta;
  shipGrabbableItemPos: Vector3ArrayWithMeta;
  Stats_StepsTaken: IntWithMeta;
  Stats_ValueCollected: IntWithMeta;
  Stats_Deaths: IntWithMeta;
  Stats_DaysSpent: IntWithMeta;
  RandomSeed: IntWithMeta;
  DeadlineTime: IntWithMeta;
  UnlockedShipObjects: IntArrayWithMeta;
  ShipUnlockStored_JackOLantern: BoolWithMeta;
  ShipUnlockStored_InverseTeleporter: BoolWithMeta;
  ShipUnlockStored_LoudHorn: BoolWithMeta;
  ShipUnlockStored_SignalTransmitter: BoolWithMeta;
  ShipUnlockStored_Bunkbeds: BoolWithMeta;
  ShipUnlockStored_RomanticTable: BoolWithMeta;
  ShipUnlockStored_Table: BoolWithMeta;
  ShipUnlockStored_RecordPlayer: BoolWithMeta;
  ShipUnlockStored_Shower: BoolWithMeta;
  ShipUnlockStored_Toilet: BoolWithMeta;
  ShipUnlockStored_FileCabinet: BoolWithMeta;
  ShipUnlockStored_Cupboard: BoolWithMeta;
  ShipUnlockStored_Television: BoolWithMeta;
  ShipUnlockStored_Teleporter: BoolWithMeta;
  EnemyScans: IntArrayWithMeta;
  StoryLogs: IntArrayWithMeta;
  GroupCredits: IntWithMeta;
  CurrentPlanetID: IntWithMeta;
  ProfitQuota: IntWithMeta;
  QuotasPassed: IntWithMeta;
  QuotaFulfilled: IntWithMeta;
  GlobalTime: IntWithMeta;
  FileGameVers: IntWithMeta;
};

function findKeyFromValue(valueToFind: any, jsonObject: any) {
  let foundKey = null;

  for (let key in jsonObject) {
    if (jsonObject[key] === valueToFind) {
      foundKey = key;
      break;
    }
  }

  return foundKey || "Unknown";
}
export function SaveFileEditor({
  save,
  setSave,
}: {
  save: LCSaveType;
  setSave: any;
}) {
  let keys = Object.keys(save) as Array<keyof LCSaveType>;
  keys = keys.filter((k) => k !== "FileGameVers");

  return (
    <div className="max-h-[70vh] overflow-auto">
      {keys.map((key, index) => {
        const value = save[key].value;

        const type = save[key].__type;

        // Function to update the Vector3 array
        const handleVector3ArrayChange = (
          key: keyof LCSaveType,
          index: number,
          newValue: string
        ) => {
          const newVector = newValue.replace(/ /g, "").split(",").map(Number);
          if (newVector.length === 3) {
            setSave((prevSave: any) => {
              const newArray = [...prevSave[key].value];
              newArray[index] = {
                x: newVector[0],
                y: newVector[1],
                z: newVector[2],
              };
              return {
                ...prevSave,
                [key]: { ...prevSave[key], value: newArray },
              };
            });
          }
        };

        const addToVector3Array = (key: keyof LCSaveType, def?: Vector3) => {
          setSave((prevSave: any) => {
            const newArray = [
              ...prevSave[key].value,
              def || { x: 0, y: 0, z: 0 },
            ];
            return {
              ...prevSave,
              [key]: { ...prevSave[key], value: newArray },
            };
          });
        };

        const removeFromVector3Array = (
          key: keyof LCSaveType,
          index: number
        ) => {
          setSave((prevSave: any) => {
            const newArray = prevSave[key].value.filter(
              (_: any, idx: any) => idx !== index
            );
            return {
              ...prevSave,
              [key]: { ...prevSave[key], value: newArray },
            };
          });
        };

        const handleIntArrayChange = (
          key: keyof LCSaveType,
          newValue: number[]
        ) => {
          setSave((prevSave: any) => {
            return {
              ...prevSave,
              [key]: { ...prevSave[key], value: newValue },
            };
          });
        };

        const addToIntArray = (key: keyof LCSaveType) => {
          setSave((prevSave: any) => {
            const newArray = [...prevSave[key].value, 0];
            return {
              ...prevSave,
              [key]: { ...prevSave[key], value: newArray },
            };
          });
        };

        const removeFromIntArray = (key: keyof LCSaveType, index: number) => {
          setSave((prevSave: any) => {
            const newArray = prevSave[key].value.filter(
              (_: any, idx: any) => idx !== index
            );
            return {
              ...prevSave,
              [key]: { ...prevSave[key], value: newArray },
            };
          });
        };

        const element = (() => {
          switch (type) {
            case "int":
              return (
                <div className="flex flex-col">
                  {key === "CurrentPlanetID" ? (
                    <>
                      <select
                        value={value as number}
                        className="text-black"
                        onChange={(e) => {
                          setSave((save: any) => {
                            return {
                              ...save,
                              [key]: {
                                ...save[key],
                                value: parseInt(e.target.value) || 0,
                              },
                            };
                          });
                        }}
                      >
                        {Object.keys(Planets).map((k, i) => {
                          return (
                            <option key={`${key}_${i}`} value={Planets[k]}>
                              {k}
                            </option>
                          );
                        })}
                      </select>
                    </>
                  ) : (
                    <input
                      name={key}
                      type="number"
                      className="text-black mb-2 w-fit"
                      value={value as number}
                      onChange={(e) => {
                        setSave((save: any) => {
                          return {
                            ...save,
                            [key]: {
                              ...save[key],
                              value: parseInt(e.target.value) || 0,
                            },
                          };
                        });
                      }}
                    />
                  )}
                </div>
              );
            case "System.Int32[],mscorlib":
              if (Array.isArray(value)) {
                return (
                  <>
                    {(value as number[]).map((val, idx) => (
                      <div
                        key={`${idx}_${key}`}
                        className="flex items-center mr-2 mb-4"
                      >
                        {key === "shipGrabbableItemIDs" ? (
                          <>
                            <select
                              value={val as number}
                              className="text-black"
                              onChange={(e) => {
                                handleIntArrayChange(key, [
                                  ...(value as number[]).slice(0, idx),
                                  parseInt(e.target.value),
                                  ...(value as number[]).slice(idx + 1),
                                ]);
                              }}
                            >
                              {Object.keys(SpawnableItems).map((k, i) => {
                                return (
                                  <option
                                    key={`${idx}_${key}_${i}`}
                                    value={SpawnableItems[k]}
                                  >
                                    {k}
                                  </option>
                                );
                              })}
                            </select>
                            <button
                              onClick={() => {
                                removeFromIntArray("shipGrabbableItemPos", idx);

                                removeFromIntArray(key, idx);
                              }}
                              className="text-white hover:text-[red] p-1 rounded-full h-5 w-5 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <>
                            <input
                              type="number"
                              value={val as number}
                              onChange={(e) => {
                                handleIntArrayChange(key, [
                                  ...(value as number[]).slice(0, idx),
                                  parseInt(e.target.value),
                                  ...(value as number[]).slice(idx + 1),
                                ]);
                              }}
                              className="text-black w-[5rem] px-2"
                            />
                            <button
                              onClick={() => {
                                removeFromIntArray(key, idx);
                              }}
                              className="text-white hover:text-[red] p-1 rounded-full h-5 w-5 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                    <div>
                      <button
                        onClick={() => {
                          if (key === "shipGrabbableItemIDs") {
                            addToVector3Array("shipGrabbableItemPos", {
                              x: -4.92634,
                              y: 0.676221848,
                              z: -14.4751444,
                            });
                          }
                          addToIntArray(key);
                        }}
                        className="bg-[green] text-white pb-0.5 mt-0.5 rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    {key === "shipGrabbableItemIDs" && (
                      <div className="w-full text-sm mb-3 text-[grey]">
                        Be sure to add the corresponding position for any new
                        items you create below :)
                      </div>
                    )}
                  </>
                );
              }

              return null;
            case "UnityEngine.Vector3[],UnityEngine.CoreModule":
              return (
                <div>
                  {Array.isArray(value) &&
                    value.map((val: any, idx) => (
                      <div
                        key={`${idx}_${key}`}
                        className="flex flex-row w-full"
                      >
                        {key === "shipGrabbableItemPos" && (
                          <div className="mr-2 w-full text-[grey]">
                            (
                            {findKeyFromValue(
                              save.shipGrabbableItemIDs.value[idx],
                              SpawnableItems
                            )}
                            )
                          </div>
                        )}
                        <input
                          type="text"
                          value={`${val.x}, ${val.y}, ${val.z}`}
                          onChange={(e) =>
                            handleVector3ArrayChange(key, idx, e.target.value)
                          }
                          className="px-2 flex flex-1 text-black text-left mb-3"
                        />
                        <button
                          onClick={() => {
                            if (key === "shipGrabbableItemPos") {
                              removeFromIntArray("shipGrabbableItemIDs", idx);
                            }

                            removeFromVector3Array(key, idx);
                          }}
                          className="text-white hover:text-[red] p-1 rounded-full h-6 w-6 flex items-center justify-center ml-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
              );
            case "bool":
              return (
                <input
                  name={key}
                  type="checkbox"
                  className="ml-2 text-black"
                  checked={value as boolean}
                  onChange={(e) => {
                    setSave((save: any) => {
                      return {
                        ...save,
                        [key]: { ...save[key], value: e.target.checked },
                      };
                    });
                  }}
                />
              );
            default:
              return null;
          }
        })();

        return (
          <div
            key={key}
            className={`flex flex-row justify-start space-x-20 text-left`}
          >
            <div
              className={`flex ${
                type === "bool" ? "flex-row mb-2" : "flex-col mb-2"
              }`}
            >
              <h3 className="mb-1">
                {key} {key === "shipGrabbableItemPos" && "(X, Y, Z)"}
              </h3>
              <div className="flex flex-wrap">{element}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
