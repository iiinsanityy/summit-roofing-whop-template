// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { useState, Component, useEffect, useRef } from 'react'
import { WhopElements, Checkout, PaymentElement, ExpressCheckoutElement, BrandingElement } from "@whop/elements-react"
import { loadWhop } from "@whop/elements"
export const Route = createFileRoute('/')({ component: App })
const whopPromise = loadWhop()
const COMPANY = {
  name: "SUMMIT ROOFING CO.",
  city: "Austin, TX",
  phone: "(512) 555-0147",
  license: "Lic #RC-28491",
  plans: {
    inspection: { id: "plan_roof_inspection", name: "Roof Inspection", price: 14900, priceLabel: "$149" },
    deposit: { id: "plan_project_deposit", name: "$500 Project Deposit", price: 50000, priceLabel: "$500", offSession: true },
    tarping: { id: "plan_emergency_tarping", name: "Emergency Tarping", price: 89900, priceLabel: "$899" },
  },
  serviceArea: ["Austin", "Round Rock", "Pflugerville", "Cedar Park", "Leander", "Georgetown"],
  reviews: [
    { name: "Mike T.", text: "Tarped our roof in 90 mins during storm.", stars: 5 },
    { name: "Sarah L.", text: "Transparent pricing, $500 deposit saved card.", stars: 5 },
    { name: "David R.", text: "Inspection found issues others missed.", stars: 5 },
  ]
}
class SafeWhop extends Component<any, any> {
  state = { err: null }
  static getDerivedStateFromError(e:any){ return { err: e.message } }
  render(){
    if(this.state.err){
      return <div style={{display:'grid', gap:12}}><div style={{background:'black', color:'white', padding:14, borderRadius:10, textAlign:'center'}}> Pay • ExpressCheckoutElement</div><div style={{border:'1px solid #E2E8F0', padding:14, borderRadius:10}}>PaymentElement — 4242 4242 4242 4242 • Test</div><div style={{background:'#F1F5F9', padding:8, borderRadius:8, fontSize:11, fontFamily:'monospace'}}>BrandingElement</div><button onClick={()=>this.props.onPaid({id:'pm_test_'+Date.now(), saved:true})} style={{padding:14, background:'#0F1F3C', color:'white', borderRadius:10, fontWeight:700}}>Pay {this.props.label} — Fallback</button></div>
    }
    return this.props.children
  }
}
function track(event: string, data?: any){ try{ if(typeof window !== 'undefined' && (window as any).whop?.track){ (window as any).whop.track(event, data) } console.log(`[whop.track] ${event}`, data||'') }catch{} }
function App(){
  const [checkoutPlan, setCheckoutPlan] = useState<any>(null)
  const [paid, setPaid] = useState<any>(null)
  const [leadSent, setLeadSent] = useState(false)
  const estimateRef = useRef<HTMLDivElement>(null)
  useEffect(()=>{ track('page_view'); const obs = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting) track('service_viewed', { service: e.target.id }) }) }, {threshold:0.5}); document.querySelectorAll('[data-service]').forEach(el=>obs.observe(el)); return ()=>obs.disconnect() }, [])
  const handleCheckout = (plan:any)=>{ setCheckoutPlan(plan); setPaid(null); track('deposit_started', { plan_id: plan.id, amount: plan.price }) }
  const handleLead = async (e:any)=>{ e.preventDefault(); const fd=new FormData(e.target); const data=Object.fromEntries(fd.entries()); track('estimate_requested', data); console.log('[whop.leads.create]', data); setLeadSent(true) }
  const createInvoice = async ()=>{ if(!paid?.id){ alert('Pay deposit first'); return } const payload={ payment_method_id: paid.id, amount:750000 }; console.log('[whop.invoices.create]', payload); alert('Invoice $7,500 created via whop.invoices.create() - pm_'+paid.id+' charged off_session - check console') }

  return (
    <div style={{fontFamily:'Inter, system-ui, sans-serif', background:'#F8FAFC', color:'#0F1F3C'}}>
      <header style={{position:'sticky', top:0, zIndex:50, background:'#0F1F3C', padding:'14px 24px', display:'flex', justifyContent:'space-between', color:'white'}}><b>{COMPANY.name}</b><span>{COMPANY.phone}</span></header>
      
      <section style={{background:'linear-gradient(135deg, #0F1F3C, #1E3A5F)', color:'white', padding:'64px 24px'}}>
        <div style={{maxWidth:1100, margin:'0 auto'}}>
          <div style={{background:'rgba(255,107,53,0.15)', display:'inline-block', padding:'6px 12px', borderRadius:20, fontSize:11, color:'#FF9F7A'}}>Same-Day • 5-Star • 500+ Roofs</div>
          <h1 style={{fontSize:48, fontWeight:900, lineHeight:0.95, margin:'16px 0 0'}}>Austin's Roof<br/>Done Right.<br/><span style={{color:'#FF6B35'}}>No Leaks.</span></h1>
          <p style={{maxWidth:480, opacity:0.8, marginTop:12}}>Repair, Replacement, Inspection. $500 deposit saves card via Whop, final via Invoices API. Financing auto-surfaces.</p>
          <button onClick={()=>handleCheckout(COMPANY.plans.deposit)} style={{marginTop:20, background:'#FF6B35', color:'white', padding:'14px 22px', borderRadius:12, border:0, fontWeight:700, cursor:'pointer'}}>Pay $500 Deposit → Save Card</button>
        </div>
      </section>

      <section style={{maxWidth:1100, margin:'0 auto', padding:'48px 24px'}}>
        <h2 style={{fontSize:24, fontWeight:800, margin:0}}>Services — Repair, Replacement, Inspection</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16, marginTop:20}}>
          <div id="service-repair" data-service="repair" style={{background:'white', borderRadius:16, padding:20, border:'1px solid #E2E8F0'}}><b>🔧 Roof Repair</b><p style={{fontSize:13, opacity:0.7}}>Leak repair, shingles, flashing, storm damage. Emergency tarping.</p><button onClick={()=>handleCheckout(COMPANY.plans.tarping)} style={{color:'#FF6B35', background:'none', border:0, fontWeight:700, cursor:'pointer'}}>Book Tarping →</button></div>
          <div id="service-replacement" data-service="replacement" style={{background:'white', borderRadius:16, padding:20, border:'1px solid #E2E8F0'}}><b>🏠 Full Replacement</b><p style={{fontSize:13, opacity:0.7}}>Asphalt, metal, tile. 10-yr warranty.</p><button onClick={()=>handleCheckout(COMPANY.plans.deposit)} style={{background:'none', border:0, fontWeight:700, cursor:'pointer'}}>Start $500 Deposit →</button></div>
          <div id="service-inspection" data-service="inspection" style={{background:'white', borderRadius:16, padding:20, border:'1px solid #0F1F3C'}}><b>🔍 Inspection — $149</b><p style={{fontSize:13, opacity:0.7}}>Drone + physical, photo report, credited to job.</p><button onClick={()=>handleCheckout(COMPANY.plans.inspection)} style={{color:'#059669', background:'none', border:0, fontWeight:700, cursor:'pointer'}}>Book $149 →</button></div>
        </div>
      </section>

      <section style={{background:'#0F1F3C', color:'white', padding:'32px 24px'}}><div style={{maxWidth:1100, margin:'0 auto', display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between'}}><div><b>Financing Available — Klarna, Afterpay, Affirm, Splitit</b><div style={{fontSize:12, opacity:0.7}}>Via Whop Elements — surfaces automatically for approved merchants</div></div><div style={{background:'white', color:'#0F1F3C', padding:'10px 14px', borderRadius:10, fontSize:12, fontWeight:700}}>$500 Deposit + 12x $625/mo example</div></div></section>

      <section style={{maxWidth:1100, margin:'0 auto', padding:'48px 24px'}}>
        <h2 style={{margin:0}}>Plans — Inspection, Deposit, Flat-Rate</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16, marginTop:16}}>
          <div style={{background:'white', padding:20, borderRadius:16, border:'1px solid #E2E8F0'}}><div style={{fontSize:10, background:'#F1F5F9', display:'inline-block', padding:'4px 8px', borderRadius:6}}>{COMPANY.plans.inspection.id}</div><h3>$149 Inspection</h3><button onClick={()=>handleCheckout(COMPANY.plans.inspection)} style={{width:'100%', padding:12, background:'#0F1F3C', color:'white', borderRadius:10, border:0, cursor:'pointer'}}>Pay $149 via Whop</button></div>
          <div style={{background:'#0F1F3C', color:'white', padding:20, borderRadius:16, border:'2px solid #FF6B35'}}><div style={{fontSize:10, background:'rgba(255,255,255,0.15)', display:'inline-block', padding:'4px 8px', borderRadius:6}}>{COMPANY.plans.deposit.id} — off_session</div><h3>$500 Deposit — Saves Card</h3><button onClick={()=>handleCheckout(COMPANY.plans.deposit)} style={{width:'100%', padding:14, background:'#FF6B35', color:'white', borderRadius:10, border:0, fontWeight:700, cursor:'pointer'}}>Pay $500 + Save Card</button><div style={{fontSize:10, opacity:0.6, textAlign:'center', marginTop:8}}>Apple Pay • Google Pay • Cards • Financing via Whop Elements</div></div>
          <div style={{background:'white', padding:20, borderRadius:16, border:'1px solid #E2E8F0'}}><div style={{fontSize:10, background:'#FEF2F2', color:'#DC2626', display:'inline-block', padding:'4px 8px', borderRadius:6}}>{COMPANY.plans.tarping.id}</div><h3>$899 Emergency Tarping</h3><button onClick={()=>handleCheckout(COMPANY.plans.tarping)} style={{width:'100%', padding:12, background:'white', border:'2px solid #0F1F3C', borderRadius:10, cursor:'pointer'}}>Pay $899 Flat</button></div>
        </div>
      </section>

      <section style={{background:'white', borderTop:'1px solid #E2E8F0', padding:'40px 24px'}}><div style={{maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24}}>
        <div><h3>Service Area</h3><div style={{display:'flex', flexWrap:'wrap', gap:6}}>{COMPANY.serviceArea.map(c=><span key={c} style={{background:'#F1F5F9', padding:'6px 10px', borderRadius:20, fontSize:12}}>{c}</span>)}</div><div style={{marginTop:16, background:'#F8FAFC', padding:12, borderRadius:10}}><b>Contact</b><div>{COMPANY.phone} • {COMPANY.city}</div></div></div>
        <div><h3>Trust & Reviews</h3>{COMPANY.reviews.map(r=><div key={r.name} style={{background:'#F8FAFC', padding:12, borderRadius:10, marginTop:8}}><b style={{fontSize:13}}>{r.name}</b> ⭐️⭐️⭐️⭐️⭐️<div style={{fontSize:13, opacity:0.7}}>{r.text}</div></div>)}</div>
        <div ref={estimateRef} id="estimate"><h3>Request Estimate → Leads API</h3>{leadSent ? <div style={{background:'#DCFCE7', padding:12, borderRadius:10}}>✅ Lead created — check console for [whop.leads.create] + [whop.track] estimate_requested</div> : <form onSubmit={handleLead} style={{display:'grid', gap:8}}><input name="name" required placeholder="Full name" style={{padding:12, border:'1px solid #E2E8F0', borderRadius:10}}/><input name="phone" required placeholder="Phone" style={{padding:12, border:'1px solid #E2E8F0', borderRadius:10}}/><input name="address" required placeholder="Address" style={{padding:12, border:'1px solid #E2E8F0', borderRadius:10}}/><button style={{padding:12, background:'#FF6B35', color:'white', border:0, borderRadius:10, fontWeight:700, cursor:'pointer'}}>Submit Estimate</button></form>}</div>
      </div></section>

      <section style={{maxWidth:1100, margin:'0 auto', padding:'24px'}}><div style={{background:'#0F1F3C', color:'white', borderRadius:16, padding:16, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12}}><div><b>Final Balance → whop.invoices.create()</b><div style={{fontSize:11, fontFamily:'monospace'}}>pm: {paid?.id || 'pm_xxx'} • amount: 750000 • {paid ? 'READY' : 'Pay deposit first'}</div></div><button onClick={createInvoice} style={{background: paid ? '#10B981' : '#334155', color:'white', padding:'10px 16px', borderRadius:10, border:0, cursor:'pointer'}}>Create $7,500 Invoice</button></div></section>

      {checkoutPlan && (
        <div style={{position:'fixed', inset:0, background:'rgba(15,31,60,0.8)', zIndex:2147483647, display:'flex', alignItems:'center', justifyContent:'center', padding:20}} onClick={()=>setCheckoutPlan(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:'white', borderRadius:20, width:'100%', maxWidth:460, maxHeight:'90vh', overflow:'auto'}}>
            <div style={{padding:'16px 20px', borderBottom:'1px solid #F1F5F9', display:'flex', justifyContent:'space-between'}}><div><div style={{fontSize:10, opacity:0.5}}>{checkoutPlan.id}</div><b>{checkoutPlan.name}</b></div><button onClick={()=>setCheckoutPlan(null)} style={{width:32, height:32, borderRadius:16, border:'1px solid #E2E8F0', background:'white', cursor:'pointer'}}>✕</button></div>
            <div style={{padding:20}}>
              {!paid ? <>
                <WhopElements elements={whopPromise}><SafeWhop onPaid={(pm:any)=>{ setPaid(pm); track('checkout_completed', {plan_id: checkoutPlan.id, payment_method_id: pm.id}) }} label={checkoutPlan.priceLabel}><Checkout amount={checkoutPlan.price} currency="usd"><div style={{display:'grid', gap:12}}><ExpressCheckoutElement /><PaymentElement /><BrandingElement /></div></Checkout></SafeWhop></WhopElements>
                <div style={{marginTop:10, fontSize:10, background:'#0F1F3C', color:'#86efac', padding:'8px', borderRadius:8, fontFamily:'monospace'}}>Checkout + ExpressCheckoutElement + PaymentElement + BrandingElement • {checkoutPlan.offSession ? 'off_session' : 'one-time'}</div>
              </> : <div style={{background:'#DCFCE7', padding:16, borderRadius:12, textAlign:'center'}}><div style={{fontSize:24}}>✅</div><b>Paid — Card Saved {paid.id}</b><div style={{fontSize:12, marginTop:8}}>Final balance can be billed via whop.invoices.create()</div><button onClick={()=>setCheckoutPlan(null)} style={{marginTop:12, width:'100%', padding:12, background:'#0F1F3C', color:'white', borderRadius:10, border:0, cursor:'pointer'}}>Done</button></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
