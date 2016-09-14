import Html exposing (..)
import Html.App as App
import Date exposing (Date)
import Date.Extra.Utils exposing (dayList, unsafeFromString)

main = App.beginnerProgram { model = model, view = view, update = update }

-- Data

-- TODO this is what I think I will need...

type alias Week =
  { startDate : Date
  , endDate : Date
  , era : String
  }


-- Model

type alias Model = 
  { birthDate: Date
  , currentDate: Date
  , selectedDate: Date
  }

model : Model
model = Model (unsafeFromString "1990-07-04") (unsafeFromString "2016-09-13") (unsafeFromString "2016-09-13")


-- Update

type Msg = SelectDate Date

update : Msg -> Model -> Model
update msg model = case msg of
  SelectDate selectedDate -> { model | selectedDate = selectedDate}


-- View

view : Model -> Html Msg
view model = div [] [text ("Selected date: " ++ toString (dayList 5 model.selectedDate))]
