# mini-flux
mini-flux 에는 제 나름대로 flux 의 동작 방식만 흉내낸 소스코드가 있습니다.  
flux 와 완전히 동일한 소스코드는 아래의 facebook-flux 아카이브에 있습니다.

# Flux 아키텍쳐

## 왜 Flux 를 선택했나

클라이언트 사이드 패턴을 공부해보면서, MVC 패턴을 그대로 사용하기 보다는 `flux` 패턴을 사용해보고 싶어서 학습 위주로 진행을 했습니다.

우선 MVC 패턴을 그대로 가져다 쓰기는 힘들다는 이야기를 듣고 조금 더 찾아보았습니다. MVC 패턴은 검색해보면 나오는 이미지가 다 다를 정도로 마치 코에 걸면 코걸이, 귀에 걸면 귀걸이인 것 처럼 MVC 패턴을 쓰기 위해 코드를 욱여넣는 것이 올바른 방법이 맞나? 라는 생각이 들었습니다.

그래서 MVVM, flux, 데이터 바인딩 등의 다양한 아키텍처를 찾아보고 어떤 방식이 좋을지를 고민해보는게 이번 주 학습의 첫 시작이였습니다.  

그 중에서 Flux 를 선택한 이유는 여러가지 있었는데,  

- 데이터의 흐름을 이해하기 쉽다.
- 1의 이유로, 앞으로 기능을 추가할 때 확장성이 좋다
- 공부할 거리가 많다! (한 개념을 깊게 공부해보고 싶었습니다)

그 외에도 마스터 클래스에서 `데이터 흐름을 단방향으로 가져가는 것이 일반적이다.` 라는 이야기를 듣기도 했고, 이번 주 스터디그룹에서 이야기가 나와서 flux 아키텍처가 가장 흥미로워보였습니다.

그런데 제가 React 나 Redux 등 프론트엔드에 정말 무지해서 학습하는데 시간이 오래 걸릴 것 같아 이걸 학습하고 적용시켜보는게 맞는지 고민이 되었지만, 네부캠이 아니면 이런 기회가 없다고 생각해서 도전해보게 되었습니다.

여러가지 flux 자료들을 찾으면서 가장 많이 활용한 자료는 [facebook-flux](https://github.com/facebookarchive/flux/blob/main/docs/Overview.ko-KR.md) 이었는데 flux 자체가 페이스북에서 먼저 제안한 방식이기 때문에 해당 레포지토리의 소스를 한 번 읽어봐야겠다 라는 생각으로 읽어보았습니다.

다만 제가 참고한 facebook-flux 의 아이디어가 실제로 나온지는 9년이 넘은 것 같고 위의 레포는 아카이브에 들어가있는, 지금은 업데이트가 되지 않는 레포입니다. 아마 더 최신의 버전이 react 나 redux 등에 있지 않을까 싶습니다. 그래서 앞으로 설명드릴 내용은 위의 facebook-flux 레포를 기준이라는 것을 미리 말씀드리고 싶습니다.

또한 프론트 문외한이 이해한 내용이라 틀린 내용이 있을 수 있습니다

참고 자료
- [facebook-flux-source](https://github.com/facebookarchive/flux/blob/main/docs/Overview.ko-KR.md)
- [facebook-flux-docs](https://facebookarchive.github.io/flux/)

### Flux
![image](https://github.com/user-attachments/assets/ba7bba5a-8da6-4abc-895f-d5417094561d)

flux 패턴의 핵심은 위의 그림에서와 같이 `단방향의 데이터 흐름` 입니다.

위의 그림에서 가장 눈에 띄는 요소는 `Dispatcher` , `Store`, `View` 입니다.

데이터의 흐름을 살펴보면 화살표가 시계방향으로만 이어져있을 뿐, 흐름이 역행하거나 단계를 건너뛰고 진행되는 일이 없습니다. 이러한 단순한 흐름 덕분에 코드의 흐름 자체를 이해하기가 쉬워지고 가독성을 얻을 수 있습니다.


#### 데이터 흐름
그렇다면 어떻게 이런 단방향의 흐름을 설계했을까요?

flux 에서는 모든 Action(사용자의 인터랙션, 타이머 함수의 실행, 서버로부터 데이터 받기 등)은 Dispatcher 라는 마치 중앙집중허브에 전달됩니다. Dispatcher 는 이런 Action 들을 모든 Store 에게 전달을 해주고, Store 는 Action 을 기준으로 자신의 상태값을 갱신합니다. 그리고 갱신이 완료되면 'change' 라는 이벤트를 emit 함으로써 View 가 새로운 상태값을 가지도록 만듭니다.

여기서 단방향의 흐름을 위해 Store 는 callback 함수를 Dispatcher 에 등록을 하게 되는데, callback 함수에는 Store 자신의 메소드를 적절히 잘 활용해서 상태값을 바꾸는 등의 역할을 수행합니다.

또한 Store 는 eventEmitter 를 활용해서 상태값이 갱신되면 'change' 라는 이벤트를 emit 합니다. 이 emit 을 통해 View 는 상태값이 바뀌었음을 알게 되고 Store 에게 새로운 상태값을 받아와 재렌더링을 합니다.

#### Dispatcher
페이스북은 여기서 Dispatcher 의 역할이 pub-sub 구조와는 조금 다르다고 이야기 합니다.
> Dispatcher는 등록된 callback에 데이터를 중계할 때 사용된다. 일반적인 pub-sub 시스템과는 다음 두 항목이 다르다:
> - 콜백은 이벤트를 개별적으로 구독하지 않는다. 모든 데이터 변동은 등록된 모든 콜백에 전달된다.
> - 콜백이 실행될 때 콜백의 전체나 일부를 중단할 수 있다.

첫 번째로 Store 의 콜백은 이벤트를 개별적으로 구독하지 않습니다. 즉 Dispatcher 에 들어오는 Action은 특정 Store 에게만 전달되는 것이 아니라 모든 Store 에게 전달됩니다. Store 는 Action 의 type 을 기준으로 자신이 필요로하는 Action 인지를 구별하여 작업을 진행합니다.

이러한 과정은 오버헤드를 불러올 것이라고 생각되는데, 그럼에도 이러한 방식을 선택한 이유를 생각해보자면 `흐름과 로직을 단순화` 할 수 있다는 것이라고 생각합니다.

두 번쨰로는 콜백이 실행될 때 다른 콜백들을 중단(지연)시킬 수 있다는 것입니다. 이는 콜백 간의 순서를 보장할 수 있다는 이야기인데 facebook 에서 들었던 예시로 살펴보겠습니다.

``` javascript
const flightDispatcher = new Dispatcher();

// 어떤 국가를 선택했는지 계속 추적한다
const CountryStore = {country: null};

// 어느 도시를 선택했는지 계속 추적한다
const CityStore = {city: null};

// 선택된 도시의 기본 항공료를 계속 추적한다
const FlightPriceStore = {price: null};
```
위의 예시는 항공편 예약 서비스로, 나라를 선택하고 해당 나라의 도시를 선택하고, 그 도시의 기본 항공료를 추적하는 시스템이라고 보면 될 것 같습니다. 사용자가 새로운 나라와 새로운 도시를 선택했다면 '새로운 나라 선택 callback' 이후에 '새로운 도시 선택 callback' 이 진행되어야 하는, 일련의 순서가 존재하게 됩니다. 따라서 flux 에는 `waitFor` 이라는 메소드로 이를 구현했습니다.

다만 이번 TodoApp 에 있어서 waitFor 이 필요하지는 않다고 생각해서 실제로 미션을 위한 flux 를 설계할때는 waitFor 을 고려하지 않았습니다.

#### Store
Store 는 도메인별로 상태를 관리합니다. Store 는 자신의 callback 을 dispatcher 에 등록합니다. callback 은 action 을 파라미터로 받아서, switch 문을 활용하여 action 의 type 을 기준으로 여러 작업을 수행합니다.

facebook 에서는 이 switch 문을 포함하고 있는 함수를 `reduce` 라고 이름 지은 것 같습니다. 따라서 저도 Store 라는 클래스에 reduce 라는 추상 메소드를 선언하고 CardStore, ColumnStore 등이 이 reduce 함수를 구현하도록 진행했습니다.

```javascript
export default abstract class Store<TState> extends EventEmitter {
  private readonly dispatcher = dispatcher;

  protected state: TState;

  protected constructor(state: TState) {
    super();
    this.state = state;
    // this.setState(state);
  }

  ...

  abstract reduce(action: Action): void;
}
```

Store 는 아래와 같은 특징이 있습니다.
- Cache data (데이터를 캐싱해둔다)
- Expose public getters to access data (never have public setters) (데이터에 접근하기 위한 Getter 를 노출시키지만, Setter 는 절대로 있어선 안된다)
- Respond to specific actions from the dispatcher (디스패처로부터 넘어온 특정 액션(관심있는 액션)에 응답한다)
- Always emit a change when their data changes (데이터의 변화가 있을 때 항상 'change' 이벤트를 emit 한다)
- Only emit changes during a dispatch (디스패치 중에만 'change' 이벤트를 emit 해야한다.)

이중에서 마지막 `Only emit changes during a dispatch` 가 살짝 의아할 수 있습니다.
dispatch 중이라는 것은, 디스패쳐로부터 데이터가 넘어왔을 때를 의미합니다. 그때 적절한 함수를 통해서 데이터를 변경하고 'change' 이벤트를 emit 할텐데 이 과정 말고 다른 추가적으로 'change' 이벤트를 emit 하는 일이 없어야한다는 의미입니다.

이는 데이터 흐름의 일관성과 예측 가능성을 유지하고 비동기 작업이나 외부 이벤트로 인한 예기치 않은 상태 변경을 방지하기 위함입니다.


#### View
마지막으로 가장 고민이 되는 View 인데 facebook flux 에서는 React 를 활용하여 View 를 만들고 재렌더링 하는 방법을 사용하고 있었습니다. 저는 react 를 잘 모르기도 하고 이번 미션에서 사용할 것도 아니였기 때문에 내부 동작을 비슷하게 가져와서 구현을 할 생각입니다. facebook-flux 에서도 Store 가 eventEmitter 를 활용하여 이벤트를 emit 하는것으로 보여서 비슷한 방식으로 View 에게 이벤트를 전달할 생각입니다.

